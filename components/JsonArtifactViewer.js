import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { JsonView } from 'react-json-view-lite'

import {
    buildJsonArtifactIndex,
    copyableJsonValue,
    isExactPublicArtifactResponseUrl,
    jsonValuePreview,
    MAX_JSON_ARTIFACT_BYTES,
    MAX_JSON_TREE_DEPTH,
    parseJsonArtifact,
    searchJsonIndex,
} from '../lib/publicJsonArtifacts.mjs'
import styles from './JsonArtifactViewer.module.css'

const MAX_EXPAND_ALL_NODES = 5_000

const TREE_STYLES = {
    container: styles.tree,
    childFieldsContainer: styles.treeChildren,
    basicChildStyle: styles.treeNode,
    collapseIcon: `${styles.treeToggle} ${styles.treeToggleExpanded}`,
    expandIcon: `${styles.treeToggle} ${styles.treeToggleCollapsed}`,
    collapsedContent: styles.treeCollapsedContent,
    label: styles.treeLabel,
    clickableLabel: `${styles.treeLabel} ${styles.treeLabelClickable}`,
    nullValue: styles.treeNull,
    undefinedValue: styles.treeNull,
    numberValue: styles.treeNumber,
    stringValue: styles.treeString,
    booleanValue: styles.treeBoolean,
    otherValue: styles.treeOther,
    punctuation: styles.treePunctuation,
    stringifyStringValues: true,
    ariaLables: {
        collapseJson: 'Collapse JSON branch',
        expandJson: 'Expand JSON branch',
    },
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`
}

function digestHex(buffer) {
    return Array.from(new Uint8Array(buffer), (byte) =>
        byte.toString(16).padStart(2, '0')
    ).join('')
}

async function readBoundedBytes(response) {
    const declaredSize = Number(response.headers.get('content-length'))
    if (
        Number.isFinite(declaredSize) &&
        declaredSize > MAX_JSON_ARTIFACT_BYTES
    ) {
        throw new Error(
            `This artifact is ${formatBytes(
                declaredSize
            )}. Interactive viewing is limited to ${formatBytes(
                MAX_JSON_ARTIFACT_BYTES
            )}; use Raw or Download instead.`
        )
    }

    if (!response.body) {
        const bytes = new Uint8Array(await response.arrayBuffer())
        if (bytes.byteLength > MAX_JSON_ARTIFACT_BYTES) {
            throw new Error(
                `This artifact exceeds the ${formatBytes(
                    MAX_JSON_ARTIFACT_BYTES
                )} interactive-view limit; use Raw or Download instead.`
            )
        }
        return bytes
    }

    const reader = response.body.getReader()
    const chunks = []
    let length = 0
    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        length += value.byteLength
        if (length > MAX_JSON_ARTIFACT_BYTES) {
            await reader.cancel()
            throw new Error(
                `This artifact exceeds the ${formatBytes(
                    MAX_JSON_ARTIFACT_BYTES
                )} interactive-view limit; use Raw or Download instead.`
            )
        }
        chunks.push(value)
    }

    const bytes = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) {
        bytes.set(chunk, offset)
        offset += chunk.byteLength
    }
    return bytes
}

export default function JsonArtifactViewer({ artifact, initialPointer = '' }) {
    const [reloadKey, setReloadKey] = useState(0)
    const [loadState, setLoadState] = useState({ kind: 'loading' })
    const [query, setQuery] = useState('')
    const [selectedPointer, setSelectedPointer] = useState(initialPointer)
    const [expansionMode, setExpansionMode] = useState(
        initialPointer ? 'path' : 'root'
    )
    const [copyStatus, setCopyStatus] = useState('')
    const searchInputRef = useRef(null)

    useEffect(() => {
        const controller = new AbortController()
        let cancelled = false
        setLoadState({ kind: 'loading' })

        async function load() {
            try {
                const response = await fetch(artifact.source, {
                    cache: 'force-cache',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json, application/x-ndjson, text/plain',
                    },
                    signal: controller.signal,
                })
                if (!response.ok) {
                    throw new Error(
                        response.status === 404
                            ? 'This JSON artifact was not found.'
                            : `The artifact could not be loaded (HTTP ${response.status}).`
                    )
                }

                if (
                    !isExactPublicArtifactResponseUrl(
                        response.url,
                        window.location.origin,
                        artifact.source
                    )
                ) {
                    throw new Error(
                        'The artifact response left its registered same-origin path, so it was not rendered.'
                    )
                }

                const bytes = await readBoundedBytes(response)
                if (!window.crypto?.subtle) {
                    throw new Error(
                        'This browser cannot verify SHA-256 integrity. Use Raw or Download instead.'
                    )
                }
                const digestInput = new Uint8Array(bytes.byteLength)
                digestInput.set(bytes)
                const digest = digestHex(
                    await window.crypto.subtle.digest(
                        'SHA-256',
                        digestInput.buffer
                    )
                )
                if (artifact.sha256 && digest !== artifact.sha256) {
                    if (!cancelled) {
                        setLoadState({
                            kind: 'error',
                            computedDigest: digest,
                            message:
                                'Integrity check failed. The loaded bytes do not match the committed SHA-256, so the tree was not rendered.',
                        })
                    }
                    return
                }

                let text
                try {
                    text = new TextDecoder('utf-8', { fatal: true }).decode(
                        bytes
                    )
                } catch {
                    throw new Error('The artifact is not valid UTF-8 text.')
                }

                let data
                try {
                    data = parseJsonArtifact(text, artifact.format)
                } catch (error) {
                    throw new Error(
                        error instanceof Error &&
                            error.message.startsWith('JSON Lines record')
                            ? error.message
                            : 'The artifact is not valid JSON.'
                    )
                }

                if (!cancelled) {
                    setLoadState({
                        kind: 'ready',
                        bytes: bytes.byteLength,
                        data,
                        digest,
                    })
                }
            } catch (error) {
                if (cancelled || controller.signal.aborted) return
                setLoadState({
                    kind: 'error',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'The artifact could not be loaded.',
                })
            }
        }

        load()
        return () => {
            cancelled = true
            controller.abort()
        }
    }, [artifact, reloadKey])

    const index = useMemo(
        () =>
            loadState.kind === 'ready'
                ? buildJsonArtifactIndex(loadState.data)
                : null,
        [loadState]
    )
    const search = useMemo(
        () =>
            index
                ? searchJsonIndex(index, query)
                : { matches: [], hasMore: false },
        [index, query]
    )
    const selected = useMemo(
        () => index?.byPointer.get(selectedPointer) || index?.nodes[0],
        [index, selectedPointer]
    )

    useEffect(() => {
        if (!index || index.byPointer.has(selectedPointer)) return
        setSelectedPointer('')
        setExpansionMode('root')
    }, [index, selectedPointer])

    const selectPointer = useCallback(
        (pointer) => {
            if (!index?.byPointer.has(pointer)) return
            setSelectedPointer(pointer)
            setExpansionMode('path')
            const url = new URL(window.location.href)
            if (pointer) url.searchParams.set('pointer', pointer)
            else url.searchParams.delete('pointer')
            window.history.replaceState(window.history.state, '', url)
        },
        [index]
    )

    const shouldExpandNode = useCallback(
        (level, value) => {
            if (expansionMode === 'all') return true
            if (expansionMode === 'root') return level < 1
            if (!index || !value || typeof value !== 'object') {
                return level < 1
            }
            const pointer = index.objectPointers.get(value)
            return (
                pointer === '' ||
                Boolean(
                    pointer &&
                        (selectedPointer === pointer ||
                            selectedPointer.startsWith(`${pointer}/`))
                )
            )
        },
        [expansionMode, index, selectedPointer]
    )

    const copyText = useCallback(async (value, success) => {
        try {
            await navigator.clipboard.writeText(value)
            setCopyStatus(success)
        } catch {
            setCopyStatus('Clipboard access was denied by the browser.')
        }
    }, [])

    const copyDeepLink = useCallback(() => {
        if (!selected) return
        const url = new URL(window.location.href)
        if (selected.pointer) {
            url.searchParams.set('pointer', selected.pointer)
        } else {
            url.searchParams.delete('pointer')
        }
        copyText(url.toString(), 'Deep link copied.')
    }, [copyText, selected])

    const treeTooLarge = Boolean(
        index && (index.truncated || index.maxDepth > MAX_JSON_TREE_DEPTH)
    )
    const canExpandAll = Boolean(
        index && !treeTooLarge && index.nodes.length <= MAX_EXPAND_ALL_NODES
    )
    const nodeCount = index
        ? `${index.nodes.length.toLocaleString()}${index.truncated ? '+' : ''}`
        : '—'

    return (
        <section
            className={styles.viewer}
            aria-labelledby="json-artifact-title"
        >
            <header className={styles.header}>
                <div>
                    <p className="eyebrow">Read-only machine evidence</p>
                    <h1 id="json-artifact-title">{artifact.title}</h1>
                    <p className={styles.description}>{artifact.description}</p>
                    <p className={styles.source}>{artifact.source}</p>
                </div>
                <div
                    className={styles.fileActions}
                    aria-label="Artifact file actions"
                >
                    <a
                        className="btn-ghost-ink"
                        href={artifact.source}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Raw
                    </a>
                    <a
                        className="btn-ghost-ink"
                        href={artifact.source}
                        download={artifact.fileName}
                    >
                        Download
                    </a>
                </div>
            </header>

            <dl className={styles.integrity}>
                <div>
                    <dt>
                        {artifact.sha256
                            ? 'Committed SHA-256'
                            : 'Integrity boundary'}
                    </dt>
                    <dd>
                        {artifact.sha256 ||
                            'Exact registered path; digest computed after load'}
                    </dd>
                </div>
                {loadState.kind === 'ready' && artifact.sha256 && (
                    <div>
                        <dt>Integrity</dt>
                        <dd>
                            <span className={styles.verified}>Verified</span>
                        </dd>
                    </div>
                )}
                {loadState.kind === 'ready' && !artifact.sha256 && (
                    <div>
                        <dt>Loaded SHA-256</dt>
                        <dd>{loadState.digest}</dd>
                    </div>
                )}
            </dl>

            <div className="sr-only" role="status" aria-live="polite">
                {loadState.kind === 'loading'
                    ? 'Loading JSON artifact.'
                    : copyStatus}
            </div>

            {loadState.kind === 'loading' && (
                <div className={styles.message} role="status">
                    <span className={styles.spinner} aria-hidden="true" />
                    Loading and checking the artifact…
                </div>
            )}

            {loadState.kind === 'error' && (
                <div className={`${styles.message} ${styles.error}`} role="alert">
                    <div>
                        <strong>Could not open the interactive view</strong>
                        <p>{loadState.message}</p>
                        {loadState.computedDigest && (
                            <p className={styles.source}>
                                Loaded SHA-256: {loadState.computedDigest}
                            </p>
                        )}
                    </div>
                    <button
                        className="btn-ghost-ink"
                        type="button"
                        onClick={() => setReloadKey((key) => key + 1)}
                    >
                        Try again
                    </button>
                </div>
            )}

            {loadState.kind === 'ready' && index && selected && (
                <>
                    <div className={styles.toolbar}>
                        <label className={styles.search}>
                            <span>Search keys, paths, and values</span>
                            <input
                                ref={searchInputRef}
                                type="search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="For example: outcome or $.surfaces[0]"
                            />
                        </label>
                        <div
                            className={styles.treeActions}
                            aria-label="JSON tree controls"
                        >
                            <button
                                className="btn-ghost-ink"
                                type="button"
                                onClick={() => setExpansionMode('all')}
                                disabled={!canExpandAll}
                                title={
                                    canExpandAll
                                        ? 'Expand every branch'
                                        : 'Expand all is disabled for large trees'
                                }
                            >
                                Expand all
                            </button>
                            <button
                                className="btn-ghost-ink"
                                type="button"
                                onClick={() => setExpansionMode('root')}
                            >
                                Collapse branches
                            </button>
                        </div>
                    </div>

                    <div
                        className={styles.facts}
                        aria-label="Artifact summary"
                    >
                        <span>
                            {artifact.format === 'jsonl'
                                ? 'JSON Lines'
                                : 'JSON'}
                        </span>
                        <span>{formatBytes(loadState.bytes)}</span>
                        <span>{nodeCount} nodes indexed</span>
                        <span title={loadState.digest}>
                            SHA-256 {loadState.digest.slice(0, 12)}…
                        </span>
                    </div>

                    {query.trim() && (
                        <section
                            className={styles.results}
                            aria-label="JSON search results"
                        >
                            <div className={styles.resultsHeading}>
                                <strong>
                                    {search.matches.length}
                                    {search.hasMore ? '+' : ''} result
                                    {search.matches.length === 1 ? '' : 's'}
                                </strong>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery('')
                                        searchInputRef.current?.focus()
                                    }}
                                >
                                    Clear search
                                </button>
                            </div>
                            {search.matches.length ? (
                                <ul>
                                    {search.matches.map((match) => (
                                        <li key={match.pointer}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    selectPointer(match.pointer)
                                                }
                                            >
                                                <span>{match.path}</span>
                                                <small>
                                                    {jsonValuePreview(
                                                        match.value
                                                    )}
                                                </small>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>
                                    No indexed keys, paths, or values match this
                                    search.
                                </p>
                            )}
                        </section>
                    )}

                    <aside
                        className={styles.selection}
                        aria-label="Focused JSON value"
                    >
                        <div>
                            <p className="eyebrow">Focused value</p>
                            <p className={styles.source}>{selected.path}</p>
                            <p>{jsonValuePreview(selected.value)}</p>
                        </div>
                        <div className={styles.selectionControls}>
                            <div className={styles.selectionActions}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        copyText(
                                            selected.path,
                                            'JSON path copied.'
                                        )
                                    }
                                >
                                    Copy path
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        copyText(
                                            copyableJsonValue(selected.value),
                                            'JSON value copied.'
                                        )
                                    }
                                >
                                    Copy value
                                </button>
                                <button type="button" onClick={copyDeepLink}>
                                    Copy deep link
                                </button>
                            </div>
                            {copyStatus && (
                                <span className={styles.copyStatus}>
                                    {copyStatus}
                                </span>
                            )}
                        </div>
                    </aside>

                    {treeTooLarge ? (
                        <div className={styles.largeTree} role="note">
                            This tree is too large or deeply nested for safe
                            interactive rendering. Search covers the first{' '}
                            {nodeCount} nodes; Raw and Download preserve the
                            complete artifact.
                        </div>
                    ) : loadState.data &&
                      typeof loadState.data === 'object' ? (
                        <div className={styles.treeWrap}>
                            <JsonView
                                data={loadState.data}
                                style={TREE_STYLES}
                                shouldExpandNode={shouldExpandNode}
                                clickToExpandNode
                                aria-label={`${artifact.title} JSON tree. Use arrow keys to navigate and expand branches.`}
                            />
                        </div>
                    ) : (
                        <pre className={styles.primitive}>
                            {JSON.stringify(loadState.data)}
                        </pre>
                    )}
                    <p className={styles.keyboardHelp}>
                        Keyboard: Tab enters the tree; Up and Down move between
                        branches; Left and Right collapse or expand the focused
                        branch.
                    </p>
                </>
            )}
        </section>
    )
}
