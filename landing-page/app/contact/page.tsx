'use client'

import { useState, FormEvent } from 'react'
import Navbar from '@/components/eleguard/Navbar'
import Footer from '@/components/eleguard/Footer'
import './contact.css'
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('@/components/eleguard/MapComponent'),
  { ssr: false }
)

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
      title: 'Phone',
      value: '+94 77 123 4567',
      link: 'tel:+94771234567',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      title: 'Email',
      value: 'eleguardlk@gmail.com',
      link: 'mailto:eleguardlk@gmail.com',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
      title: 'Location',
      value: 'Matara, Sri Lanka',
      link: '#',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="contact-page">
        {/* Hero */}
        <section className="contact-hero">
          <div className="container">
            <h1 className="contact-hero-title">Get in Touch</h1>
            <p className="contact-hero-description">
              Have questions about EleGuardLK? We&apos;re here to help. Reach out to us and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-main section">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-card">
                <h2>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary submit-btn">
                    Send Message
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="contact-info-section">
                <h2>Contact Information</h2>
                <p className="contact-info-description">
                  Reach out to us through any of the following channels. We typically respond within 24 hours.
                </p>
                
                <div className="contact-info-cards">
                  {contactInfo.map((info, index) => (
                    <a key={index} href={info.link} className="contact-info-card">
                      <div className="contact-info-icon">{info.icon}</div>
                      <div className="contact-info-content">
                        <span className="contact-info-title">{info.title}</span>
                        <span className="contact-info-value">{info.value}</span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Interactive Map */}
                <div className="map-section">
                  <h3>Find Us</h3>
                  <MapComponent />
                </div>

                {/* Office Hours */}
                <div className="office-hours">
                  <h3>Office Hours</h3>
                  <ul>
                    <li>
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li>
                      <span>Saturday</span>
                      <span>9:00 AM - 1:00 PM</span>
                    </li>
                    <li>
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="contact-faq section">
          <div className="container">
            <div className="faq-card">
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to common questions about EleGuardLK, installation, and support.</p>
              <a href="#" className="btn btn-secondary">View FAQ</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
