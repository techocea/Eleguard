import './Hero.css'

export default function Hero() {
  return (
    <section 
      className="hero"
      style={{
        backgroundImage: 'url(/images/hero-elephant.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="hero-overlay">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Smart Protection. Safer Communities.
            </span>
            
            <h1 className="hero-title">
              Protecting Farms.<br />
              Preventing<br />
              <span className="text-green">Elephant Encounters.</span>
            </h1>
            
            <p className="hero-description">
              EleGuardLK uses advanced geophone sensors to detect elephant movement early and alert farmers in real-time. Together, let&apos;s reduce human-elephant conflict in Sri Lanka.
            </p>
            
            <div className="hero-buttons">
              <a href="/register" className="btn btn-primary">
                Get Started
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </a>
              <a href="/how-it-works" className="btn btn-secondary">
                Learn More
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <polygon points="10,8 16,12 10,16" fill="currentColor" />
                </svg>
              </a>
            </div>
            
            <div className="hero-trust">
              <div className="trust-avatars">
                <div className="avatar" style={{ backgroundColor: '#66BB6A' }}>K</div>
                <div className="avatar" style={{ backgroundColor: '#2E7D32' }}>S</div>
                <div className="avatar" style={{ backgroundColor: '#81C784' }}>R</div>
              </div>
              <span className="trust-text">Trusted by farmers across Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
