import React, { useRef, useState } from 'react';

import styles from './IndustriesGrid.module.css';
import Image from 'next/image';

export default function IndustriesGrid({ feedbackData, setFeedbackData, sectionRef }) {
  const gridData = [
    {
      title: 'HR',
      descriptions: 'Boost team productivity in HR operations. Automate candidate sourcing using LinkedIn Recruiter, LinkedIn Talent Solutions, GetProspect, Reply.io, outreach.io, Gmail/Outlook, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-human-resources.svg',
    },
    {
      title: 'Law',
      descriptions: 'Streamline legal procedures and case management. Automate tasks like generating legal documents, managing contracts, tracking cases, and conducting legal research with LexisNexis, Westlaw, Adobe Acrobat, Microsoft Excel, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-law.svg',
    },
    {
      title: 'Insurance',
      descriptions: 'Optimize productivity in insurance. Automate policy management, claims processing, data analysis, and document collaboration with PolicyCenter, Xactimate, Excel, SharePoint, PowerBI, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-insurance.svg',
    },
    {
      title: 'Healthcare',
      descriptions: 'Advance patient care and streamline operations. Automate revenue cycle management, clinical documentation, and scheduling in Cerner, Epic, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-healthcare.svg',
    },
    {
      title: 'Logistics',
      descriptions: 'Automate tasks with Transportation Management Systems (TMS), Freight Management Systems (FMS), Load Tracking Systems, and Document Management Systems for efficient tracking, scheduling, and financial record-keeping.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-freight.svg',
    },
    {
      title: 'Pharmacy',
      descriptions: 'Enhance accuracy and inventory management. Automate prescription management, inventory control, medication dispensing, and patient records with Krol (Telus), Filware, Healthwatch, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-pharmacy.svg',
    },
    {
      title: 'Customer Support',
      descriptions: 'Automate customer inquiries, ticket management, collaboration, data analysis, and communication using OracleHCM, Workday, SAP, Excel, SharePoint, Outlook, LinkedIn, Teams, PowerBI, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-customer-support.svg',
    },
    {
      title: 'Sales Development',
      descriptions: 'Automate repetitive tasks in OracleHCM, LinkedIn, SalesForce, and Gmail for lead generation, prospecting, and communication to optimize revenue growth.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-sales-development.svg',
    },
    {
      title: 'Let us build for you',
      descriptions: "If OpenAdapt doesn't fully automate your workflow out of the box, we'll work with you to fix that.",
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-build.svg',
    },
  ];

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleButtonClick = (title) => {
    let data = {
      email: '',
      message: title === 'Let us build for you' ? '' : `I'm interested in how OpenAdapt can help me make ${title} better.`
    };
    setFeedbackData(data);
    scrollToSection();
  };

  return (
    <div className={styles.background} id="industries">
      <div>
        <h1 className={styles.heading}>Achieve more with less effort.</h1>
        <p className={styles.p}>
          Our technology observes and records your software interactions, automating repetitive tasks.<br />
          Spend less time on manual processes and more on tasks that truly matter.
        </p>
      </div>
      <div className={styles.row}>
        {gridData.map((grid, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.logo}>
              <Image
                className="invert text-center inline"
                priority
                src={grid.logo}
                height={60}
                width={60}
                alt={grid.title}
              />
            </div>
            <h2 className={styles.title}>{grid.title}</h2>
            <ul className={styles.descriptions}>
              {grid.descriptions.split('\n').map((description) => (
                <li key={grid.title}>{description}</li>
              ))}
            </ul>
            {grid.title === 'Developers' ? (
              <a href="#start" className={styles.button}>
                {grid.buttonLabel}
              </a>
            ) : (
              <button className={styles.button} onClick={() => handleButtonClick(grid.title)}>{grid.buttonLabel}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
