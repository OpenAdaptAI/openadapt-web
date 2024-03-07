import React from 'react';
import styles from '@styles/LegalPages.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.paragraph}>
        At OpenAdapt.AI, we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our products and services.
      </p>

      <h2 className={styles.subheading}>1. Data Collection and Usage</h2>
      <p className={styles.paragraph}>
        OpenAdapt is an open-source desktop software that records your screen, keyboard, mouse, and optionally microphone inputs locally on your machine. OpenAdapt transforms this recorded data using various algorithms to generate prompts and instructions for AI language models. All data is scrubbed of all Personally Identifiable Information (PII) and Protected Health Information (PHI) before being uploaded. Before data is uploaded, you will be presented with the scrubbed data and required to confirm that it has been properly sanitized of all PII/PHI. We do not store or collect any of your personal data, files, or process recordings. For product improvement and performance evaluation purposes, we may collect anonymized usage data and analytics through third-party services like Google Analytics.
      </p>

      <h2 className={styles.subheading}>2. Third-Party Services</h2>
      <p className={styles.paragraph}>
        Our desktop software connects to third-party AI service providers (e.g., OpenAI, Claude.ai) to leverage their state-of-the-art language models for process automation based on the prompts and instructions generated from your recorded data. Any data shared with these third-party services is subject to their respective privacy policies, and we encourage you to review them.
      </p>

			<h2 className={styles.subheading}>3. Data Security</h2>
			<p className={styles.paragraph}>
				OpenAdapt employs industry-standard security measures in the software's architecture to ensure the safe use of API keys and payment information. While OpenAdapt itself does not store your personal data or API keys, we facilitate secure interactions with third-party services, including Stripe for payment processing. For users who choose to use the OpenAdapt API key, we securely manage the connection to third-party services on your behalf. Please be aware that while we strive to use commercially acceptable means to protect your information, no method of transmission over the internet, or method of electronic storage is 100% secure. We cannot guarantee absolute security of data managed by third-party services.
			</p>

      <h2 className={styles.subheading}>4. Children's Privacy</h2>
      <p className={styles.paragraph}>
        Our products and services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children.
      </p>

      <h2 className={styles.subheading}>5. Changes to this Privacy Policy</h2>
      <p className={styles.paragraph}>
        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on our website, and we encourage you to review it periodically.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
