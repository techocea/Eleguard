import Navbar from '@/components/eleguard/Navbar'
import Footer from '@/components/eleguard/Footer'
import './about.css'

export default function AboutPage() {
  const team = [
    {
      name: 'Kavishka Chathuranga',
      role: 'Undergraduate',
      description: 'Department of Computer Science, Faculty of Science, University of Ruhuna.',
    },
    {
      name: 'Ravindu Lakshitha',
      role: 'Undergraduate',
      description: 'Department of Computer Science, Faculty of Science, University of Ruhuna.',
    },
    {
      name: 'Sachini Tharindhya',
      role: 'Undergraduate',
      description: 'Department of Computer Science, Faculty of Science, University of Ruhuna.',
    },
    {
      name: 'Ishini Shanika',
      role: 'Undergraduate',
      description: 'Department of Computer Science, Faculty of Science, University of Ruhuna.',
    },
    {
      name: 'Tharusha Dilshan',
      role: 'Undergraduate',
      description: 'Department of Computer Science, Faculty of Science, University of Ruhuna.',
    },
    {
      name: 'Brightly Dunsford',
      role: 'Undergraduate',
      description: 'Department of Computer Science, Faculty of Science, University of Ruhuna.',
    },
  ]

  const values = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Protection',
      description: 'We are committed to protecting both farmers and wildlife through innovative technology.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: 'Community',
      description: 'Building stronger rural communities through collaborative protection systems.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Continuously improving our technology to provide the best protection possible.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: 'Sustainability',
      description: 'Promoting sustainable agriculture while preserving wildlife habitats.',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="container">
            <h1 className="about-hero-title">About EleGuardLK</h1>
            <p className="about-hero-description">
              We are on a mission to reduce human-elephant conflict in Sri Lanka through innovative technology and community engagement.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-mission section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h2>Our Mission</h2>
                <p>
                  To protect farming communities and wildlife by providing early warning systems that prevent human-elephant conflicts, saving lives and livelihoods while promoting coexistence.
                </p>
              </div>
              <div className="vision-card">
                <div className="vision-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h2>Our Vision</h2>
                <p>
                  A Sri Lanka where farmers and elephants coexist peacefully, where technology bridges the gap between conservation and agriculture, and where no family loses their livelihood to wildlife conflict.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="about-story section">
          <div className="container">
            <div className="story-content">
              <h2>Our Story</h2>
              <p>
                EleGuardLK was born from a simple observation: farmers in rural Sri Lanka were losing their crops, their property, and sometimes their lives to elephant intrusions, while elephants were being harmed in conflicts with humans.
              </p>
              <p>
                In 2020, our founder Dr. Saman Perera witnessed firsthand the devastation caused by elephant intrusions in Walapane. A single night of elephant activity destroyed an entire season&apos;s worth of crops for several farming families. That experience sparked the idea for EleGuard.
              </p>
              <p>
                Working with engineers, wildlife experts, and farming communities, we developed a geophone-based early warning system that detects elephant movement through ground vibrations. Today, EleGuardLK protects over 1,250 fields across 12 districts, helping families sleep peacefully knowing their farms are monitored 24/7.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="about-values section">
          <div className="container">
            <h2 className="section-title">Our Values</h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-team section">
          <div className="container">
            <h2 className="section-title">Meet Our Team</h2>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-avatar">
                    <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="team-name">{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p className="team-description">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="about-impact section">
          <div className="container">
            <div className="impact-card">
              <h2>Our Impact</h2>
              <div className="impact-stats">
                <div className="impact-stat">
                  <span className="impact-value">850+</span>
                  <span className="impact-label">Farming Families Protected</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-value">15,600+</span>
                  <span className="impact-label">Successful Alerts Sent</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-value">Zero</span>
                  <span className="impact-label">Human Casualties in Protected Areas</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-value">95%</span>
                  <span className="impact-label">Reduction in Crop Damage</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta section">
          <div className="container">
            <div className="about-cta-card">
              <h2>Join Our Mission</h2>
              <p>Help us create a safer future for farmers and wildlife in Sri Lanka.</p>
              <div className="about-cta-buttons">
                <a href="/register" className="btn btn-primary">Get Started</a>
                <a href="/contact" className="btn btn-secondary">Partner With Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
