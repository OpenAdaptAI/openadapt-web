import styles from './IndustriesGrid.module.css';

export default function IndustriesGrid() {
  const gridData = [
    {
      title: 'HR',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Law',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Insurance',
      checkpoints: ['Optimize your operational costs', 'Help adjusters and underwriters automate daunting tasks', 'Future-proof your insurance business with automation'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Healthcare',
      checkpoints: ['Focus on patient care, not paperwork', 'Reduce burnout-inducing administrative tasks', 'Drive positive healthcare outcomes with automation'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Freight',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Pharmacy',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Customer Support',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Sales Development',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Let us build for you',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Developers',
      checkpoints: ['1', '2', '3'],
      buttonLabel: 'Join Waitlist',
    },
  ];

  return (
    <div className={styles.container}>
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
