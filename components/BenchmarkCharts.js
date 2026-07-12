import { useId } from 'react'

/*
 * Native inline-SVG benchmark charts for /compare.
 *
 * Every number rendered here comes from data/benchmark.json, which is copied
 * verbatim from the openadapt-flow results.json files (see provenance in that
 * file). Nothing is hand-typed into the markup, so the published charts cannot
 * drift from the measured results.
 *
 * Colors are driven entirely by the site's CSS design tokens (var(--accent),
 * var(--ink), var(--ink-2), var(--ink-3), var(--hairline)), so the charts
 * follow the site theme rather than hardcoding light/dark values.
 */

const COMPILED = 'var(--accent)' // OpenAdapt compiled replay — the win
const AGENT = 'var(--ink-2)' // computer-use agent — muted
const TRACK = 'var(--hairline)'
const CAPTION = 'var(--ink-3)'
const INK = 'var(--ink)'

const numStyle = { fontVariantNumeric: 'tabular-nums' }

function fmtSec(s) {
    return `${s.toFixed(1)}s`
}

function fmtCost(c) {
    return c === 0 ? '$0' : `$${c.toFixed(2)}`
}

// Horizontal latency chart: one row per arm. A light track runs to p95, a
// solid bar runs to p50, and a tick marks p95 — so both percentiles read at a
// glance on a single shared axis.
function LatencyChart({ compiled, agent, titleId, descId }) {
    const max = Math.max(compiled.wall_s_p95, agent.wall_s_p95)
    const x0 = 6
    const x1 = 330
    const W = x1 - x0
    const scale = (v) => (v / max) * W
    const barH = 15
    const rows = [
        { name: 'Compiled', data: compiled, color: COMPILED, y: 30 },
        { name: 'Agent', data: agent, color: AGENT, y: 78 },
    ]
    const axisY = 118
    return (
        <svg
            viewBox="0 0 336 136"
            width="100%"
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            style={{ display: 'block' }}
        >
            <title id={titleId}>Latency per run: compiled replay vs computer-use agent</title>
            <desc id={descId}>
                Median run {fmtSec(compiled.wall_s_p50)} compiled versus{' '}
                {fmtSec(agent.wall_s_p50)} for the agent; 95th percentile{' '}
                {fmtSec(compiled.wall_s_p95)} versus {fmtSec(agent.wall_s_p95)}.
            </desc>
            {rows.map((row) => {
                const p50w = scale(row.data.wall_s_p50)
                const p95w = scale(row.data.wall_s_p95)
                return (
                    <g key={row.name}>
                        <text
                            x={x0}
                            y={row.y - 6}
                            fontSize="11"
                            fontWeight="600"
                            fill={INK}
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {row.name}
                        </text>
                        {/* p95 in a fixed right column — never overflows */}
                        <text
                            x={x1}
                            y={row.y - 6}
                            fontSize="9.5"
                            fill={CAPTION}
                            textAnchor="end"
                            style={numStyle}
                        >
                            p95 {fmtSec(row.data.wall_s_p95)}
                        </text>
                        {/* p95 track */}
                        <rect
                            x={x0}
                            y={row.y}
                            width={p95w}
                            height={barH}
                            rx="2"
                            fill={row.color}
                            fillOpacity="0.16"
                        />
                        {/* p50 solid bar */}
                        <rect
                            x={x0}
                            y={row.y}
                            width={p50w}
                            height={barH}
                            rx="2"
                            fill={row.color}
                        />
                        {/* p95 tick */}
                        <line
                            x1={x0 + p95w}
                            x2={x0 + p95w}
                            y1={row.y - 2}
                            y2={row.y + barH + 2}
                            stroke={row.color}
                            strokeWidth="1.5"
                        />
                        {/* p50 value */}
                        <text
                            x={x0 + p50w + 6}
                            y={row.y + barH - 3}
                            fontSize="12"
                            fontWeight="700"
                            fill={INK}
                            style={{ ...numStyle, fontFamily: 'var(--font-display)' }}
                        >
                            {fmtSec(row.data.wall_s_p50)}
                        </text>
                    </g>
                )
            })}
            {/* axis */}
            <line
                x1={x0}
                x2={x1}
                y1={axisY}
                y2={axisY}
                stroke={TRACK}
                strokeWidth="1"
            />
            <text x={x0} y={axisY + 12} fontSize="9.5" fill={CAPTION} style={numStyle}>
                0s
            </text>
            <text
                x={x1}
                y={axisY + 12}
                fontSize="9.5"
                fill={CAPTION}
                textAnchor="end"
                style={numStyle}
            >
                {fmtSec(max)}
            </text>
            <text
                x={(x0 + x1) / 2}
                y={axisY + 12}
                fontSize="9.5"
                fill={CAPTION}
                textAnchor="middle"
            >
                solid = median (p50) · tick = p95
            </text>
        </svg>
    )
}

// Cost chart: agent cost per run as a bar, compiled pinned at an emphasized
// zero endpoint. The zero is the point — a filled dot and a "$0" that stays $0
// on every run, forever.
function CostChart({ compiled, agent, runs, titleId, descId }) {
    const x0 = 6
    const x1 = 300
    const W = x1 - x0
    const barH = 20
    const agentW = W // agent is the only nonzero cost, so it fills the plot
    const compiledY = 26
    const agentY = 66
    const agent500 = Math.round(agent.cost_usd_per_run * runs)
    return (
        <svg
            viewBox="0 0 336 120"
            width="100%"
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            style={{ display: 'block' }}
        >
            <title id={titleId}>Model cost per run: compiled replay vs computer-use agent</title>
            <desc id={descId}>
                Compiled replay costs {fmtCost(compiled.cost_usd_per_run)} per run;
                the agent costs {fmtCost(agent.cost_usd_per_run)} per run at list
                price. Over {runs} runs that is $0 versus about ${agent500}.
            </desc>
            {/* Compiled row: emphasized zero endpoint */}
            <text
                x={x0}
                y={compiledY - 6}
                fontSize="11"
                fontWeight="600"
                fill={INK}
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Compiled
            </text>
            {/* zero baseline stub + emphasized dot */}
            <rect x={x0} y={compiledY} width="10" height={barH} rx="2" fill={COMPILED} />
            <circle cx={x0 + 5} cy={compiledY + barH / 2} r="5.5" fill={COMPILED} />
            <circle cx={x0 + 5} cy={compiledY + barH / 2} r="2.25" fill="var(--panel)" />
            <text
                x={x0 + 22}
                y={compiledY + barH - 4}
                fontSize="15"
                fontWeight="700"
                fill={COMPILED}
                style={{ ...numStyle, fontFamily: 'var(--font-display)' }}
            >
                {fmtCost(compiled.cost_usd_per_run)}
            </text>
            <text
                x={x0 + 52}
                y={compiledY + barH - 5}
                fontSize="10"
                fill={CAPTION}
            >
                every run, forever
            </text>
            {/* Agent row */}
            <text
                x={x0}
                y={agentY - 6}
                fontSize="11"
                fontWeight="600"
                fill={INK}
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Agent
            </text>
            <rect x={x0} y={agentY} width={agentW} height={barH} rx="2" fill={AGENT} />
            <text
                x={x0 + agentW - 8}
                y={agentY + barH - 5}
                fontSize="13"
                fontWeight="700"
                fill="var(--panel)"
                textAnchor="end"
                style={{ ...numStyle, fontFamily: 'var(--font-display)' }}
            >
                {fmtCost(agent.cost_usd_per_run)} / run
            </text>
            <text x={x0} y={112} fontSize="9.5" fill={CAPTION} style={numStyle}>
                at {runs} runs: $0 vs ~${agent500} · list price, model cost only
            </text>
        </svg>
    )
}

// A stat readout that mirrors the site's existing "big number + caption" cards.
function Stat({ value, label }) {
    return (
        <div>
            <p
                className="font-display text-2xl font-semibold text-ink"
                style={numStyle}
            >
                {value}
            </p>
            <p className="mt-1 text-sm text-ink-2">{label}</p>
        </div>
    )
}

export default function BenchmarkCharts({ dataset, runs = 500 }) {
    const { compiled, agent } = dataset
    const ids = {
        latT: useId(),
        latD: useId(),
        costT: useId(),
        costD: useId(),
    }
    const speedup = (agent.wall_s_p50 / compiled.wall_s_p50).toFixed(1)
    return (
        <div className="mt-5">
            <div className="grid gap-6 sm:grid-cols-3">
                <Stat
                    value={`${speedup}× faster`}
                    label={`median run: ${fmtSec(compiled.wall_s_p50)} compiled vs ${fmtSec(
                        agent.wall_s_p50
                    )} agent`}
                />
                <Stat
                    value={`${fmtCost(compiled.cost_usd_per_run)} vs ${fmtCost(
                        agent.cost_usd_per_run
                    )}`}
                    label="model cost per run, at list price"
                />
                <Stat
                    value={`${compiled.model_calls_per_run} vs ~${agent.model_calls_per_run}`}
                    label="model calls per run"
                />
            </div>
            <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
                <figure className="rounded-xl border border-hairline bg-ground/60 p-4">
                    <figcaption className="eyebrow mb-3">
                        Latency per run
                    </figcaption>
                    <LatencyChart
                        compiled={compiled}
                        agent={agent}
                        titleId={ids.latT}
                        descId={ids.latD}
                    />
                </figure>
                <figure className="rounded-xl border border-hairline bg-ground/60 p-4">
                    <figcaption className="eyebrow mb-3">
                        Model cost per run
                    </figcaption>
                    <CostChart
                        compiled={compiled}
                        agent={agent}
                        runs={runs}
                        titleId={ids.costT}
                        descId={ids.costD}
                    />
                    <p className="sr-only">
                        Compiled {fmtCost(compiled.cost_usd_per_run)} per run;
                        agent {fmtCost(agent.cost_usd_per_run)} per run.
                    </p>
                </figure>
            </div>
        </div>
    )
}
