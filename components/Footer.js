import Image from 'next/image';
import Link from 'next/link';

import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className={styles.footerContainer}>
            <footer className="grid grid-flow-row auto-rows-max gap-4">
                <div className="m-auto pb-10">
                    <Image
                        className="invert"
                        priority
                        src="/images/favicon.svg"
                        height={32}
                        width={32}
                        alt="Large Language Model"
                    />
                </div>
                <div className={styles.footerContent}>
                    <p>© {currentYear} OpenAdaptAI and MLDSAI Inc. All rights reserved.</p>
                    <p>Our software is open source and licensed under the MIT License.</p>
                    <div className={ `${styles.socialLinks} pt-20` }>
                        <Link href="https://github.com/OpenAdaptAI/OpenAdapt" className={styles.link} passHref>
                            GitHub
                        </Link>
                        <Link href="https://x.com/OpenAdaptAI" className={styles.link} passHref>
                            X
                        </Link>
                        <Link href="https://www.linkedin.com/company/95677624" className={styles.link} passHref>
                            LinkedIn
                        </Link>
                    </div>
                    <ul className={styles.footerLinks}>
                        <li><Link href="mailto:hello@openadapt.ai" className={styles.link} passHref>Contact</Link></li>
                        <li><Link href="/privacy-policy" className={styles.link} passHref>Privacy Policy</Link></li>
                        <li><Link href="/terms-of-service" className={styles.link} passHref>Terms of Service</Link></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}
