import styles from './IndustriesGrid.module.css';
import Image from 'next/image';

export default function IndustriesGrid() {

  const gridData = [
    {
      title: 'HR',
      descriptions: 'Transform HR operations and boost team productivity with automation, driving strategic decision-making and talent management.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-human-resources.svg',
    },
    {
      title: 'Law',
      descriptions: 'Streamline your legal procedures and amplify case management efficacy by delegating repetitive tasks to our automation solution.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-law.svg',
    },
    {
      title: 'Insurance',
      descriptions: 'Optimize operational costs',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-insurance.svg',
    },
    {
      title: 'Healthcare',
      descriptions: 'Optimize patient care and medical record keeping by integrating our automation tool, freeing healthcare professionals for critical tasks.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-healthcare.svg',
    },
    {
      title: 'Freight',
      descriptions: 'Upgrade your logistics, ensure on-time deliveries and increase efficiency by automating repetitive tasks in your freight business.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-freight.svg',
    },
    {
      title: 'Pharmacy',
      descriptions: 'Reinforce accuracy, patient safety and efficient inventory management in your pharmacy with our dependable automation product.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-pharmacy.svg',
    },
    {
      title: 'Customer Support',
      descriptions: 'Revolutionize customer service by automifying mundane tasks, enhancing response times and fostering superior customer satisfaction.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-customer-support.svg',
    },
    {
      title: 'Sales Development',
      descriptions: 'Elevate your sales strategy by automating repetitive tasks, freeing your team to focus on strategic client engagement and revenue growth.',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-sales-development.svg',
    },
    {
      title: 'Let us build for you',
      descriptions: 'Customize automation solutions',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-build.svg',
    },
    {
      title: 'Developers',
      descriptions: 'Simplify software development processes',
      buttonLabel: 'Join Waitlist',
      logo: '/images/noun-developer.svg',
    },
  ];

  return (
    <div className={styles.background}>
      <div>
        <h2 className={styles.heading}>Achieve more with less effort.</h2>
        <p className={styles.p}>
          Our technology observes and records your software interactions, automating repetitive tasks.<br />
          Spend less time on manual processes and more on tasks that truly matter.
        </p>
      </div>
      <br />
      <h1 className={styles.heading} id="industries">
        Revolutionizing Industries with AI-First Automation for Growth and Transformation.
      </h1>
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
            {grid.title === 'Developers' ? (
              <a href="#start" className={styles.button}>
                {grid.buttonLabel}
              </a>
            ) : (
              <button className={styles.button}>{grid.buttonLabel}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
