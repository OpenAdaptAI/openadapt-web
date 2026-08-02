// Redirect stub: /call is the low-friction "talk to a human" path used in
// outreach. The canonical scheduler page is /book, which embeds the Cal.com
// destination defined in utils/booking.js (DEFAULT_BOOKING_URL) — change the
// scheduler there, not here. Non-permanent so this route can later become its
// own page without fighting cached 308s. Redirect stubs stay out of
// sitemap.xml and llms.txt (tests/aiDiscoverability.test.js enforces this).
export default function CallPage() {
    return null
}

export function getServerSideProps() {
    return {
        redirect: {
            destination: '/book',
            permanent: false,
        },
    }
}
