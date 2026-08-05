// OpenAdapt owns the stable public product path. The customer-specific service
// stays on its separate deployment boundary and private source repository.
export default function customerPlaybookPage() {
    return null
}

export function getServerSideProps({ res }) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
    return {
        redirect: {
            destination: 'https://playbooks.openadapt.ai/customer',
            permanent: false,
        },
    }
}
