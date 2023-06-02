//import Logo from '@components/Logo'
import Image from 'next/image';

import MastHead from '@components/MastHead'
import FeedbackForm from "@components/FeedbackForm";
import Footer from "@components/Footer";

export default function Home() {
    return (
		<div>
			<MastHead />
			<FeedbackForm />
            <Footer />
		</div>
    )
}
