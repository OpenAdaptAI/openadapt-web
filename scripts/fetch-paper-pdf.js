#!/usr/bin/env node
/**
 * Build-time fetch for the OpenAdapt paper PDF.
 *
 * openadapt.ai serves the paper at https://openadapt.ai/openadapt-paper.pdf,
 * which maps to public/openadapt-paper.pdf. To keep that URL always current
 * without hand-committing a copy that drifts from the LaTeX source, this
 * script downloads the freshest build from the openadapt-flow `paper-latest`
 * GitHub release (published by openadapt-flow's Paper workflow) before
 * `next build`.
 *
 * Safety contract (never break a deploy over a transient fetch problem):
 *   - Download to a temp file, not the destination, so a partial/failed
 *     download can never replace a good committed copy.
 *   - Validate the download is a real PDF (`%PDF` magic bytes) and of
 *     non-trivial size before promoting it into place.
 *   - On ANY failure (network, non-200, non-PDF, too-small, timeout) keep the
 *     committed fallback at public/openadapt-paper.pdf and log a clear warning.
 *   - Always exit 0. This script is advisory: it upgrades the committed PDF
 *     when it can, and is otherwise a no-op.
 */

const fs = require('node:fs')
const path = require('node:path')

const RELEASE_URL =
  process.env.PAPER_PDF_URL ||
  'https://github.com/OpenAdaptAI/openadapt-flow/releases/download/paper-latest/openadapt-paper.pdf'

const DEST = path.join(__dirname, '..', 'public', 'openadapt-paper.pdf')
const TMP = path.join(__dirname, '..', 'public', '.openadapt-paper.pdf.tmp')

// A real paper PDF is hundreds of KB. Anything under this is almost certainly
// an error page, an empty object, or a truncated download -- reject it.
const MIN_BYTES = 20 * 1024
const TIMEOUT_MS = 20000

function warn(msg) {
  console.warn(`[fetch-paper-pdf] WARNING: ${msg}`)
}

function info(msg) {
  console.log(`[fetch-paper-pdf] ${msg}`)
}

function fallbackNotice(reason) {
  if (fs.existsSync(DEST)) {
    warn(
      `${reason}. Keeping committed fallback at public/openadapt-paper.pdf ` +
        `(${fs.statSync(DEST).size} bytes). The served PDF may be stale.`
    )
  } else {
    warn(
      `${reason}. No committed fallback at public/openadapt-paper.pdf exists; ` +
        `the /openadapt-paper.pdf route will 404 until a build succeeds or the ` +
        `fallback is committed.`
    )
  }
}

function cleanupTmp() {
  try {
    if (fs.existsSync(TMP)) fs.unlinkSync(TMP)
  } catch (_) {
    /* best-effort */
  }
}

async function main() {
  info(`Fetching latest paper PDF from ${RELEASE_URL}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let buf
  try {
    // Node 18+/22 global fetch follows redirects (GitHub release download
    // 302s to objects.githubusercontent.com) automatically.
    const res = await fetch(RELEASE_URL, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'openadapt-web-build' },
    })
    if (!res.ok) {
      fallbackNotice(`Fetch returned HTTP ${res.status}`)
      return
    }
    buf = Buffer.from(await res.arrayBuffer())
  } catch (err) {
    fallbackNotice(`Fetch failed (${err && err.name ? err.name : 'error'}: ${err && err.message ? err.message : err})`)
    return
  } finally {
    clearTimeout(timer)
  }

  // Validate: real PDF magic bytes.
  if (buf.length < 4 || buf.subarray(0, 4).toString('latin1') !== '%PDF') {
    fallbackNotice('Downloaded file is not a PDF (missing %PDF magic bytes)')
    return
  }
  // Validate: non-trivial size.
  if (buf.length < MIN_BYTES) {
    fallbackNotice(`Downloaded PDF is implausibly small (${buf.length} bytes)`)
    return
  }

  try {
    fs.writeFileSync(TMP, buf)
    fs.renameSync(TMP, DEST) // atomic promote over the committed fallback
    info(`Updated public/openadapt-paper.pdf from release (${buf.length} bytes).`)
  } catch (err) {
    cleanupTmp()
    fallbackNotice(`Could not write PDF to disk (${err && err.message ? err.message : err})`)
  }
}

main()
  .catch((err) => {
    cleanupTmp()
    fallbackNotice(`Unexpected error (${err && err.message ? err.message : err})`)
  })
  .finally(() => {
    // Advisory step: a fetch problem must never fail the deploy.
    process.exit(0)
  })
