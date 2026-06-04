import './HowItWorks.css'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      title: 'Register Your Field',
      description: 'Sign up and add your field details in a few simple steps.',
    },
    {
      number: 2,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a5 5 0 015 5v4a5 5 0 01-10 0V7a5 5 0 015-5z" />
          <path d="M8.5 16.5S9.5 18 12 18s3.5-1.5 3.5-1.5" />
          <path d="M12 18v4M8 22h8" />
          <path d="M2 12a2 2 0 012-2h1M19 12h1a2 2 0 012 0" />
        </svg>
      ),
      title: 'Deploy Sensors',
      description: 'Place geophone sensors around your field.',
    },
    {
      number: 3,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4" />
        </svg>
      ),
      title: 'Detect Vibrations',
      description: 'Sensors detect elephant movement through vibrations.',
    },
    {
      number: 4,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      ),
      title: 'Get Instant Alerts',
      description: 'Receive real-time notifications and take action early.',
    },
  ]

  return (
    <section className="how-it-works section">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.number} className="step-wrapper">
              <div className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-arrow">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
