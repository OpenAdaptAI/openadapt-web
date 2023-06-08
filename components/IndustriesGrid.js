import styles from './IndustriesGrid.module.css';

export default function IndustriesGrid() {

  const gridData = [
    {
      title: 'HR',
      checkpoints: ['Increase employee productivity', 'Streamline recruitment processes', 'Automate HR tasks'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Law',
      checkpoints: ['Improve legal document management', 'Automate contract review processes', 'Enhance legal research'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Insurance',
      checkpoints: ['Optimize operational costs', 'Automate underwriting tasks', 'Improve claims processing efficiency'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Healthcare',
      checkpoints: ['Enhance patient care delivery', 'Automate administrative tasks', 'Improve healthcare outcomes'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Freight',
      checkpoints: ['Streamline logistics operations', 'Automate freight tracking', 'Optimize supply chain management'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Pharmacy',
      checkpoints: ['Improve medication dispensing processes', 'Enhance inventory management', 'Automate prescription verification'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Customer Support',
      checkpoints: ['Enhance customer service experience', 'Automate ticket management', 'Improve response time'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Sales Development',
      checkpoints: ['Automate lead generation', 'Improve sales forecasting', 'Enhance customer relationship management'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Let us build for you',
      checkpoints: ['Customize automation solutions', 'Tailor workflows to your needs', 'Maximize operational efficiency'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Developers',
      checkpoints: ['Simplify software development processes', 'Automate code testing', 'Accelerate project delivery'],
      buttonLabel: 'Join Waitlist',
    },
  ];

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>Achieve more with less effort.</h2>
          <p className={styles.p}>
          Our technology observes and records your software interactions, automating repetitive tasks.<br></br>
          Spend less time on manual processes and more on tasks that truly matter.
          </p>
      </div>
      <br>
      </br>
      <h1 className={styles.heading}>

        Revolutionizing Industries with AI-First Automation for Growth and Transformation.
      </h1>
      <div className={styles.row}>
        {gridData.map((grid, index) => (
          <div key={index} className={styles.card}>
            <h2 className={styles.title}>{grid.title}</h2>
            <ul className={styles.checkpoints}>
              {grid.checkpoints.map((checkpoint, checkpointIndex) => (
                <li key={checkpointIndex}>{checkpoint}</li>
              ))}
            </ul>
            <button className={styles.button}>{grid.buttonLabel}</button>
          </div>
        ))}
      </div>
    </div>

  );
}
