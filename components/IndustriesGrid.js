import styles from './IndustriesGrid.module.css';
import Image from 'next/image';

export default function IndustriesGrid() {

  const gridData = [
    {
      title: 'HR',
      descriptions: 'Enhance Boost team productivity in HR operations with automation. Automate candidate sourcing using LinkedIn Recruiter, LinkedIn Talent Solutions, GetProspect, Reply.io, outreach.io, Gmail/Outlook, and more.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-human-resources.svg',
    },
    {
      title: 'Law',
      descriptions: 'Streamline legal procedures and case management. Automate tasks like generating legal documents, managing contracts, tracking cases, and conducting legal research with LexisNexis, Westlaw, Adobe Acrobat, and Microsoft Excel.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-law.svg',
    },
    {
      title: 'Insurance',
      descriptions: 'Optimize productivity in insurance. Automate policy management, claims processing, data analysis, and document collaboration with GuideWire PolicyCenter, Excel, SharePoint, PowerBI, and specialized tools.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-insurance.svg',
    },
    {
      title: 'Healthcare',
      descriptions: 'Advance patient care and streamline operations. Utilize Cerner, Epic, PowerBI, and other tools to automate patient data management, medical billing, clinical documentation, and data analytics.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-healthcare.svg',
    },
    {
      title: 'Logistics',
      descriptions: 'Upgrade logistics for on-time deliveries. Automate tasks with TMS, Freight Management Systems (FMS), Load Tracking Systems, and Document Management Systems for efficient tracking, scheduling, and financial record-keeping.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-freight.svg',
    },
    {
      title: 'Pharmacy',
      descriptions: 'Enhance accuracy and inventory management. Automate prescription management, inventory control, medication dispensing, and patient records with Krol (Telus), Filware, Healthwatch, and industry-specific tools.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-pharmacy.svg',
    },
    {
      title: 'Customer Support',
      descriptions: 'Revolutionize customer service with automation. Automate customer inquiries, ticket management, collaboration, data analysis, and communication using OracleHCM, Workday, SAP, Excel, SharePoint, Outlook, LinkedIn, Teams, and PowerBI.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-customer-support.svg',
    },
    {
      title: 'Sales Development',
      descriptions: 'Automate repetitive tasks in sales. Use OracleHCM, LinkedIn, SalesForce, and Gmail to automate lead generation, prospecting, CRM, and communication for efficient sales pipeline management and revenue growth.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-sales-development.svg',
    },
    {
      title: 'Let us build for you',
      descriptions: 'Customize automation solution.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-build.svg',
    },
  ];

  return (
    <div className={styles.background}>
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
                <li>{description}</li>
              ))}
            </ul>
              <button className={styles.button}>{grid.buttonLabel}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
