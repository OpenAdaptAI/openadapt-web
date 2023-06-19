import React, { useRef, useState } from 'react';

import styles from './IndustriesGrid.module.css';
import FeedbackForm from "@components/FeedbackForm";

export default function IndustriesGrid() {

  const gridData = [
    {
      title: 'HR',
      descriptions: 'Transform HR operations and boost team productivity with automation, driving strategic decision-making and talent management.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Law',
      descriptions: 'Streamline your legal procedures and amplify case management efficacy by delegating repetitive tasks to our automation solution.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Insurance',
      descriptions: 'Optimize operational costs',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Healthcare',
      descriptions: 'Optimize patient care and medical record keeping by integrating our automation tool, freeing healthcare professionals for critical tasks.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Freight',
      descriptions: 'Upgrade your logistics, ensure on-time deliveries and increase efficiency by automating repetitive tasks in your freight business.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Pharmacy',
      descriptions: 'Reinforce accuracy, patient safety and efficient inventory management in your pharmacy with our dependable automation product.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Customer Support',
      descriptions: 'Revolutionize customer service by automifying mundane tasks, enhancing response times and fostering superior customer satisfaction.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Sales Development',
      descriptions: 'Elevate your sales strategy by automating repetitive tasks, freeing your team to focus on strategic client engagement and revenue growth.',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Let us build for you',
      descriptions: 'Customize automation solutions',
      buttonLabel: 'Join Waitlist',
    },
    {
      title: 'Developers',
      descriptions: 'Simplify software development processes',
      buttonLabel: 'Join Waitlist',
    },
  ];

  const sectionRef = useRef(null);

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [feedbackData, setFeedbackData] = useState({
    email: '',
    message: ''
  });

  const handleButtonClick = (title) => {
    // Fill in the feedback form data based on the button clicked
    let data = {
      email: '',
      message: `I'm interested in how OpenAdapt can help me make ${title} better.`
    };

    if (title === 'Let us build for you') {
      data.message = '';
    }
    // Update the feedback data state
    setFeedbackData(data);

    // Scroll to the feedback form section 
    scrollToSection();
  };

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
      <h1 className={styles.heading} id ="industries">
        Revolutionizing Industries with AI-First Automation for Growth and Transformation.
      </h1>
      <div className={styles.row}>
        {gridData.map((grid, index) => (
          <div key={index} className={styles.card}>
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
      <div ref={sectionRef}>
        <FeedbackForm feedbackData={feedbackData} />
      </div>
    </div>
  );
}
