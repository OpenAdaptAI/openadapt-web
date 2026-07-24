export default function ContactPage() {
    return null
}

export function getServerSideProps() {
    return {
        redirect: {
            destination: '/qualify',
            permanent: true,
        },
    }
}
