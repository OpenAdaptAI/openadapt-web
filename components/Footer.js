import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Function to handle the reveal of the email address
    const revealEmail = () => {
        // Construct the email address and open in mail client
        const user = 'hello';
        const domain = 'openadapt.ai';
        window.location.href = `mailto:${user}@${domain}`;
    };

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
                    <div className={`${styles.socialLinks} pt-20`}>
                        <a href="https://github.com/OpenAdaptAI" className={styles.link}>GitHub</a>
                        <a href="https://discord.gg/yF527cQbDG" className={styles.link}>Discord</a>
                        <a href="https://x.com/OpenAdaptAI" className={styles.link}>X</a>
                        <a href="https://www.linkedin.com/company/95677624" className={styles.link}>LinkedIn</a>
                    </div>
                    <ul className={styles.footerLinks}>
                        <li><a href="https://github.com/OpenAdaptAI/OpenAdapt?tab=readme-ov-file#-open-contract-positions-at-openadaptai" className={styles.link}>Careers</a></li>
                        <li><a onClick={revealEmail} className={styles.link} style={{cursor: 'pointer'}}>Contact</a></li>
                        <li><a href="/privacy-policy" className={styles.link}>Privacy Policy</a></li>
                        <li><a href="/terms-of-service" className={styles.link}>Terms of Service</a></li>
                    </ul>
                    <p className="mt-10">© {currentYear} OpenAdaptAI and MLDSAI Inc. All rights reserved.</p>
                    <p>Our software is open source and licensed under the MIT License.</p>
                </div>
            </footer>
        </div>
    );
}
