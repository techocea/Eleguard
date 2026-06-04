'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Navbar from '@/components/eleguard/Navbar'
import Footer from '@/components/eleguard/Footer'
import './register.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Registration submitted:', formData)
    // Handle registration logic
  }

  return (
    <>
      <Navbar />
      <main className="register-page">
        <div className="register-container">
          <div className="register-visual">
            <div className="visual-content">
              <h2>Join EleGuard LK</h2>
              <p>Start protecting your farm with advanced elephant detection technology.</p>
              <div className="visual-stats">
                <div className="visual-stat">
                  <span className="stat-number">850+</span>
                  <span className="stat-label">Farmers Protected</span>
                </div>
                <div className="visual-stat">
                  <span className="stat-number">15,600+</span>
                  <span className="stat-label">Alerts Sent</span>
                </div>
                <div className="visual-stat">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Districts Covered</span>
                </div>
              </div>
              <div className="visual-testimonial">
                <p>&quot;EleGuard LK has transformed how we protect our crops. We finally have peace of mind.&quot;</p>
                <span>- Kamal P., Walapane Farmer</span>
              </div>
            </div>
          </div>

          <div className="register-card">
            <div className="register-header">
              <div className="register-logo">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" fill="#2E7D32" />
                  <path d="M20 8C14 8 10 12 10 18C10 20 10.5 21.5 11.5 23C12 24 12 25 12 26V28H16V26C16 24.5 15.5 23 14.5 21.5C14 21 13.5 20 13.5 18C13.5 14 16 11 20 11C24 11 26.5 14 26.5 18C26.5 20 26 21 25.5 21.5C24.5 23 24 24.5 24 26V28H28V26C28 25 28 24 28.5 23C29.5 21.5 30 20 30 18C30 12 26 8 20 8Z" fill="white" />
                  <circle cx="16" cy="16" r="2" fill="white" />
                  <circle cx="24" cy="16" r="2" fill="white" />
                </svg>
              </div>
              <h1>Create Account</h1>
              <p>Join EleGuard LK and start protecting your farm</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
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
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  required
                />
                <span className="checkmark"></span>
                I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>
              </label>

              <button type="submit" className="btn btn-primary register-btn">
                Create Account
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </button>
            </form>

            <div className="register-footer">
              <p>Already have an account? <Link href="/login">Sign In</Link></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
