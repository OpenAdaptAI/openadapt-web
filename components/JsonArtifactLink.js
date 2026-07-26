import Link from 'next/link'

import { publicJsonViewerHref } from '../lib/publicJsonArtifacts.mjs'

/**
 * Route a known public JSON artifact through the human-readable viewer while
 * leaving unsupported URLs as ordinary raw links. The latter is intentional:
 * the viewer allowlist must not expand merely because a caller supplied a URL.
 */
export default function JsonArtifactLink({ source, children, ...props }) {
    const viewerHref = publicJsonViewerHref({ source })
    if (!viewerHref) {
        return (
            <a href={source} {...props}>
                {children}
            </a>
        )
    }

    return (
        <Link href={viewerHref} {...props}>
            {children}
        </Link>
    )
}
