#!/usr/bin/env node
/**
 * Scheduled snapshot fetch for the homepage install-stats visual.
 *
 * The homepage renders PyPI adoption (installs this month, top package, and an
 * installs-over-time plot) from a COMMITTED snapshot at data/installStats.json.
 * The site never calls pypistats.org at build or request time -- it reads the
 * committed JSON in getStaticProps. That keeps the homepage always fast and
 * impossible to break over a flaky/rate-limited upstream (pypistats.org 429s
 * aggressively; see pages/api/pypistats/[package].js for the history).
 *
 * This script is the ONLY thing that talks to pypistats.org. It is run by the
 * scheduled GitHub Action (.github/workflows/refresh-install-stats.yml), which
 * opens a PR with the refreshed JSON. It can also be run by hand:
 *
 *     node scripts/fetch-install-stats.js
 *
 * Safety contract (never emit a broken snapshot):
 *   - Fetch everything first, aggregate, and VALIDATE before writing.
 *   - Write to a temp file, then promote, so a partial run can never replace a
 *     good committed snapshot.
 *   - On ANY failure (network, non-200, empty/short data, validation) keep the
 *     committed data/installStats.json untouched and exit 0. The snapshot is
 *     advisory: it upgrades the committed numbers when it can, else no-op.
 *   - `mirrors=false` so counts reflect real installs, not mirror traffic.
 */

const fs = require('node:fs')
const path = require('node:path')

// Core, user-facing openadapt packages. Dev tools (herald/crier/wright/etc.)
// and internal infra are intentionally excluded so the homepage number is
// "people installing the product", not automation noise. Keep in sync with the
// core set in lib/packageDiscovery.js.
const PACKAGES = [
  'openadapt',
  'openadapt-flow',
  'openadapt-capture',
  'openadapt-ml',
  'openadapt-types',
  'openadapt-privacy',
]

const DEST = path.join(__dirname, '..', 'data', 'installStats.json')
const TMP = path.join(__dirname, '..', 'data', '.installStats.json.tmp')

const TIMEOUT_MS = 20000
const MAX_RETRIES = 4
// pypistats.org retains ~180 days of daily "overall" data. Anything shorter
// than this many aggregated months is almost certainly a truncated fetch.
const MIN_HISTORY_MONTHS = 2

function warn(msg) {
  console.warn(`[fetch-install-stats] WARNING: ${msg}`)
}
function info(msg) {
  console.log(`[fetch-install-stats] ${msg}`)
}

function keepFallback(reason) {
  if (fs.existsSync(DEST)) {
    warn(
      `${reason}. Keeping committed snapshot at data/installStats.json ` +
        `(the homepage numbers may be stale until the next successful run).`
    )
  } else {
    warn(
      `${reason}. No committed data/installStats.json exists; the homepage ` +
        `install-stats section will render its empty fallback until a run succeeds.`
    )
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson(url) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    let res
    try {
      res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'openadapt-web install-stats snapshot' },
      })
    } catch (error) {
      clearTimeout(timer)
      if (attempt === MAX_RETRIES) throw error
      await sleep(Math.min(8000, 800 * 2 ** attempt) * (0.5 + Math.random()))
      continue
    }
    clearTimeout(timer)

    if (res.ok) return res.json()

    const retryable = res.status === 429 || res.status >= 500
    if (!retryable || attempt === MAX_RETRIES) {
      const err = new Error(`pypistats.org returned ${res.status} for ${url}`)
      err.status = res.status
      throw err
    }
    const retryAfter = Number(res.headers.get('retry-after'))
    const backoff = Math.min(8000, 800 * 2 ** attempt) * (0.5 + Math.random())
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 10000)
        : backoff
    await sleep(wait)
  }
  throw new Error(`pypistats.org fetch failed for ${url}`)
}

async function fetchRecent(pkg) {
  const data = await fetchJson(
    `https://pypistats.org/api/packages/${pkg}/recent?mirrors=false`
  )
  const d = (data && data.data) || {}
  return {
    name: pkg,
    lastDay: Number(d.last_day) || 0,
    lastWeek: Number(d.last_week) || 0,
    lastMonth: Number(d.last_month) || 0,
  }
}

// Aggregate daily "overall" (mirrors excluded) into a per-month combined total
// across all packages. Returns a Map<'YYYY-MM', downloads>.
async function accumulateMonthly(pkg, monthly) {
  const data = await fetchJson(
    `https://pypistats.org/api/packages/${pkg}/overall?mirrors=false`
  )
  const rows = (data && data.data) || []
  for (const row of rows) {
    if (!row || !row.date) continue
    const month = String(row.date).slice(0, 7) // YYYY-MM
    monthly.set(month, (monthly.get(month) || 0) + (Number(row.downloads) || 0))
  }
}

async function main() {
  info(`Fetching PyPI stats for ${PACKAGES.length} packages from pypistats.org`)

  let recents
  const monthly = new Map()
  try {
    recents = []
    for (const pkg of PACKAGES) {
      recents.push(await fetchRecent(pkg))
      await sleep(1500) // be polite to pypistats.org; avoid 429s
    }
    for (const pkg of PACKAGES) {
      await accumulateMonthly(pkg, monthly)
      await sleep(1500)
    }
  } catch (error) {
    keepFallback(`Upstream fetch failed (${error.message})`)
    return
  }

  // Build the monthly history series, oldest -> newest. Drop the current
  // (in-progress) partial month so the plot never shows a misleading dip.
  const nowMonth = new Date().toISOString().slice(0, 7)
  const history = Array.from(monthly.entries())
    .filter(([month]) => month < nowMonth)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([month, downloads]) => ({ month, downloads }))

  const totalLastMonth = recents.reduce((acc, p) => acc + p.lastMonth, 0)
  const packages = recents
    .slice()
    .sort((a, b) => b.lastMonth - a.lastMonth)
  const topPackage = packages[0] || null

  // Validation: refuse to write a snapshot that would degrade the homepage.
  if (!Number.isFinite(totalLastMonth) || totalLastMonth <= 0) {
    keepFallback('Aggregated last-month total is zero or invalid')
    return
  }
  if (!topPackage || topPackage.lastMonth <= 0) {
    keepFallback('No package has a positive last-month total')
    return
  }
  if (history.length < MIN_HISTORY_MONTHS) {
    keepFallback(
      `Only ${history.length} full month(s) of history (need >= ${MIN_HISTORY_MONTHS})`
    )
    return
  }

  const snapshot = {
    asOf: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    source: 'pypistats.org',
    sourceUrl: 'https://pypistats.org/packages/openadapt',
    note: 'Excludes mirror traffic. Aggregated across core openadapt-* PyPI packages.',
    totalLastMonth,
    topPackage: { name: topPackage.name, lastMonth: topPackage.lastMonth },
    packages: packages.map((p) => ({
      name: p.name,
      lastDay: p.lastDay,
      lastWeek: p.lastWeek,
      lastMonth: p.lastMonth,
    })),
    history,
  }

  try {
    fs.writeFileSync(TMP, JSON.stringify(snapshot, null, 2) + '\n')
    fs.renameSync(TMP, DEST)
  } catch (error) {
    try {
      if (fs.existsSync(TMP)) fs.unlinkSync(TMP)
    } catch (_) {
      /* best-effort */
    }
    keepFallback(`Could not write snapshot (${error.message})`)
    return
  }

  info(
    `Wrote data/installStats.json: ${totalLastMonth.toLocaleString()} installs ` +
      `last month across ${packages.length} packages; top = ${topPackage.name} ` +
      `(${topPackage.lastMonth.toLocaleString()}); ${history.length} months of history.`
  )
}

main().catch((error) => {
  // Absolute last-resort guard: never fail the workflow over a snapshot.
  keepFallback(`Unexpected error (${error && error.message})`)
  process.exit(0)
})
