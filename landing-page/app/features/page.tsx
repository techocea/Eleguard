import Navbar from '@/components/eleguard/Navbar'
import Footer from '@/components/eleguard/Footer'
import './features.css'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      ),
      title: 'Real-time Alerts',
      description: 'Get instant push notifications on your mobile device the moment elephant activity is detected near your field. Never miss a critical alert again.',
      highlights: ['Push notifications', 'SMS alerts', 'Email notifications', 'Customizable alert settings'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      title: 'Smart Detection',
      description: 'Our AI-powered system accurately distinguishes elephant footsteps from other ground vibrations, reducing false alarms while ensuring no real threat goes unnoticed.',
      highlights: ['AI pattern recognition', '95% accuracy rate', 'Continuous learning', 'False alarm filtering'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
      title: 'Dashboard & Map',
      description: 'Monitor all your fields from a single, intuitive dashboard. View sensor status, alert history, and elephant activity patterns on an interactive map.',
      highlights: ['Interactive map view', 'Real-time sensor status', 'Historical data', 'Activity heatmaps'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
      title: 'GPS Field Tracking',
      description: 'Precisely define your field boundaries using GPS coordinates. Our system uses this data to optimize sensor placement and provide accurate location alerts.',
      highlights: ['Boundary mapping', 'Multiple field support', 'Precision tracking', 'Zone management'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      title: 'Easy Deployment',
      description: 'Install sensors yourself with our simple guide, or request professional installation. Our modular system makes it easy to expand coverage as needed.',
      highlights: ['DIY installation', 'Professional support', 'Modular design', 'Quick setup'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security. Our system is designed for 99.9% uptime with redundant backups and fail-safe mechanisms.',
      highlights: ['End-to-end encryption', '99.9% uptime', 'Data backup', 'Secure cloud storage'],
    },
  ]

  const technicalSpecs = [
    { label: 'Detection Range', value: 'Up to 100m' },
    { label: 'Response Time', value: '< 2 seconds' },
    { label: 'Battery Life', value: '12+  hours' },
    { label: 'Connectivity', value: 'LoRa / GSM' },
    { label: 'Weather Rating', value: 'IP67' },
    { label: 'Operating Temp', value: '-20°C to 60°C' },
  ]

  return (
    <>
      <Navbar />
      <main className="features-page">
        {/* Hero */}
        <section className="features-hero">
          <div className="container">
            <h1 className="features-hero-title">Powerful Features for Complete Protection</h1>
            <p className="features-hero-description">
              Explore the advanced capabilities of EleGuardLK that help you protect your crops and livelihood.
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="features-main section">
          <div className="container">
            <div className="features-grid-large">
              {mainFeatures.map((feature, index) => (
                <div key={index} className="feature-card-large">
                  <div className="feature-icon-large">{feature.icon}</div>
                  <div className="feature-content-large">
                    <h3 className="feature-title-large">{feature.title}</h3>
                    <p className="feature-description-large">{feature.description}</p>
                    <ul className="feature-highlights">
                      {feature.highlights.map((highlight, idx) => (
                        <li key={idx}>
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="features-specs section">
          <div className="container">
            <h2 className="section-title">Technical Specifications</h2>
            <div className="specs-grid">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="spec-card">
                  <span className="spec-value">{spec.value}</span>
                  <span className="spec-label">{spec.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="features-dashboard section">
          <div className="container">
            <div className="dashboard-feature-grid">
              <div className="dashboard-feature-content">
                <h2>Intuitive Dashboard Experience</h2>
                <p>
                  Our web and mobile dashboard puts all the information you need at your fingertips. Monitor multiple fields, view detailed analytics, and manage your entire protection system from one place.
                </p>
                <ul className="dashboard-features-list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Real-time sensor monitoring
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Comprehensive alert history
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Detailed analytics reports
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Mobile app for on-the-go access
                  </li>
                </ul>
              </div>
              <div className="dashboard-feature-visual">
                <div className="dashboard-preview-card">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>EleGuard Dashboard</span>
                  </div>
                  <div className="preview-content">
                    <div className="preview-sidebar">
                      <div className="sidebar-nav-item active"></div>
                      <div className="sidebar-nav-item"></div>
                      <div className="sidebar-nav-item"></div>
                      <div className="sidebar-nav-item"></div>
                    </div>
                    <div className="preview-main">
                      <div className="preview-stats">
                        <div className="preview-stat"></div>
                        <div className="preview-stat"></div>
                        <div className="preview-stat"></div>
                      </div>
                      <div className="preview-chart"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="features-cta section">
          <div className="container">
            <div className="features-cta-card">
              <h2>Experience These Features Today</h2>
              <p>Join hundreds of farmers already protecting their fields with EleGuardLK.</p>
              <div className="features-cta-buttons">
                <a href="/register" className="btn btn-primary">Get Started Free</a>
                <a href="/contact" className="btn btn-secondary">Request Demo</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
