import Navbar from '@/components/eleguard/Navbar'
import Footer from '@/components/eleguard/Footer'
import './how-it-works.css'

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Register Your Field',
      description: 'Create your account and add details about your agricultural fields. Provide location coordinates, field size, and crop information to help us optimize sensor placement.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Deploy Sensors',
      description: 'Our geophone sensors are strategically placed around your field perimeter. You can self-deploy following our guide or request professional installation assistance.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Detect Vibrations',
      description: 'Geophones detect ground vibrations caused by elephant movement. Our AI algorithms analyze the patterns to distinguish elephant footsteps from other sources.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h2M6 12h2M10 12h2M14 12h2M18 12h2M22 12h0" />
          <path d="M4 8v8M8 6v12M12 4v16M16 6v12M20 8v8" />
        </svg>
      ),
    },
    {
      number: 4,
      title: 'Get Instant Alerts',
      description: 'Receive real-time notifications on your mobile device when elephant activity is detected. Alerts include location, time, and recommended actions.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      ),
    },
  ]

  const benefits = [
    {
      title: 'Early Warning System',
      description: 'Detect elephants up to 500 meters away, giving you valuable time to respond.',
    },
    {
      title: '24/7 Monitoring',
      description: 'Continuous surveillance of your fields, day and night, rain or shine.',
    },
    {
      title: 'Low Maintenance',
      description: 'Sensors are durable and weather-resistant with long battery life.',
    },
    {
      title: 'Community Network',
      description: 'Alerts can be shared with neighboring farms for collective protection.',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="how-it-works-page">
        {/* Hero Section */}
        <section className="hiw-hero">
          <div className="container">
            <h1 className="hiw-hero-title">How EleGuardLK Works</h1>
            <p className="hiw-hero-description">
              Our advanced geophone technology detects elephant movement early, giving you time to protect your crops and stay safe.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="hiw-steps section">
          <div className="container">
            <h2 className="section-title">Simple 4-Step Process</h2>
            <div className="steps-timeline">
              {steps.map((step, index) => (
                <div key={step.number} className="timeline-step">
                  <div className="timeline-content">
                    <div className="step-card-large">
                      <div className="step-number-large">{step.number}</div>
                      <div className="step-icon-large">{step.icon}</div>
                      <h3 className="step-title-large">{step.title}</h3>
                      <p className="step-description-large">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="timeline-connector">
                      <div className="connector-line"></div>
                      <div className="connector-arrow">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="hiw-technology section">
          <div className="container">
            <div className="tech-grid">
              <div className="tech-content">
                <h2 className="tech-title">Advanced Geophone Technology</h2>
                <p className="tech-description">
                  Our sensors use seismic detection technology originally developed for geological surveys. This proven technology can detect ground vibrations from large animals like elephants from significant distances.
                </p>
                <ul className="tech-features">
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    High sensitivity seismic sensors
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    AI-powered pattern recognition
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Wireless connectivity
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Weather-resistant design
                  </li>
                </ul>
              </div>
              <div className="tech-visual">
                <div className="sensor-illustration">
                  <div className="sensor-device">
                    <div className="sensor-antenna"></div>
                    <div className="sensor-body"></div>
                    <div className="sensor-stake"></div>
                  </div>
                  <div className="vibration-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="hiw-benefits section">
          <div className="container">
            <h2 className="section-title">Why Choose EleGuardLK</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="hiw-cta section">
          <div className="container">
            <div className="hiw-cta-card">
              <h2>Ready to Protect Your Farm?</h2>
              <p>Get started with EleGuardLK today and experience peace of mind.</p>
              <div className="hiw-cta-buttons">
                <a href="/register" className="btn btn-primary">Get Started</a>
                <a href="/contact" className="btn btn-secondary">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
