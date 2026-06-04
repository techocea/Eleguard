import './CTA.css'

export default function CTA() {
  return (
    <section className="cta-section section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-bg-elements">
            <div className="cta-leaf cta-leaf-1"></div>
            <div className="cta-leaf cta-leaf-2"></div>
            <div className="cta-elephant"></div>
          </div>
          
          <div className="cta-content">
            <h2 className="cta-title">Start Protecting Your Farm Today</h2>
            <p className="cta-description">
              Join EleGuardLK and be part of a safer tomorrow for farmers and wildlife.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn cta-btn-secondary">
                Contact Us
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </a>
              <a href="/register" className="btn cta-btn-primary">
                Register Now
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
