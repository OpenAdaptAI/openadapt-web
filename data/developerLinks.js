/**
 * Canonical developer ecosystem destinations.
 *
 * Single source of truth shared by the top-navigation "Developers"
 * dropdown (components/NavHeader.js) and the lower-page open-source
 * section (components/Developers.js) so the two surfaces can never
 * drift apart.
 */

export const BLOG_LINK = {
    label: 'Blog',
    href: 'https://blog.openadapt.ai',
}

export const DEVELOPER_LINKS = [
    {
        label: 'Compiler/runtime source',
        href: 'https://github.com/OpenAdaptAI/openadapt-flow',
    },
    {
        label: 'Docs',
        href: 'https://docs.openadapt.ai',
    },
    {
        label: 'Technical paper',
        href: '/openadapt-paper.pdf',
    },
    {
        label: 'Discord',
        href: 'https://discord.gg/yF527cQbDG',
    },
    {
        label: 'Report an issue',
        href: 'https://github.com/OpenAdaptAI/openadapt-flow/issues/new/choose',
    },
]
