import ContactBookingSection from '@components/ContactBookingSection'
import Footer from '@components/Footer'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#06061f] text-white">
            <ContactBookingSection showHomeLink />
            <Footer />
        </div>
    )
}
