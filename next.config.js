/**
 * @type {import('next').NextConfig}
 *
 * No framework behavior is customized here beyond redirects; the site
 * otherwise uses Next.js defaults (see netlify.toml for deploy config).
 */
const nextConfig = {
    async redirects() {
        return [
            {
                // People guess /signin from the hosted-dashboard mentions;
                // send them to the real hosted login instead of a 404.
                source: '/signin',
                destination: 'https://app.openadapt.ai/login',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig
