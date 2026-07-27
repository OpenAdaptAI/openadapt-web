import benchmark from '../data/benchmark.json'

/*
 * One derivation of the engine build the published benchmark numbers were
 * measured on.
 *
 * Every surface that renders a figure from data/benchmark.json renders its
 * attribution from here, so a reader never sees a number without knowing which
 * engine produced it, and so the label cannot drift from the data. The strings
 * are derived, never retyped: changing data/benchmark.json changes every label.
 *
 * The numbers were measured on 2026-07-08 from a source checkout that declared
 * openadapt-flow 0.1.0 — before v0.2.0, the first release tag containing the
 * pinned commit. Saying "0.1.0" is the accurate statement; rounding it to a
 * v1.x release would claim an engine that did not exist when the runs happened.
 */

export const provenance = benchmark.provenance

export const FLOW_VERSION = provenance.flow_version
export const MEASURED_ON = provenance.measured_on
export const COMMIT = provenance.commit
export const SHORT_COMMIT = provenance.commit.slice(0, 7)

// "Measured 2026-07-08 on openadapt-flow 0.1.0 (pre-v0.2.0 source build)"
export const ATTRIBUTION = provenance.attribution

// "Flow 0.1.0 (pre-v0.2.0) · 2026-07-08" — for chart captions and chips.
export const ATTRIBUTION_SHORT = provenance.attribution_short

export const VERSION_NOTE = provenance.flow_version_note

export const COMMIT_URL = `https://github.com/${provenance.source_repo}/tree/${provenance.commit}`
