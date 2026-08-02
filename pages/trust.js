// Redirect stub: /trust is a common guess for the trust center, which lives
// at /security (the footer labels it "Trust center"). Keep this a redirect so
// external links and typed URLs never 404. Redirect stubs stay out of
// sitemap.xml and llms.txt (tests/aiDiscoverability.test.js enforces this).
export default function TrustPage() {
    return null
}

export function getServerSideProps() {
    return {
        redirect: {
            destination: '/security',
            permanent: true,
        },
    }
}
