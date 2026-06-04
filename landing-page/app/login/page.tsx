'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Navbar from '@/components/eleguard/Navbar'
import Footer from '@/components/eleguard/Footer'
import './login.css'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Login submitted:', formData)
    // Handle login logic
  }

  return (
    <>
      <Navbar />
      <main className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" fill="#2E7D32" />
                  <path d="M20 8C14 8 10 12 10 18C10 20 10.5 21.5 11.5 23C12 24 12 25 12 26V28H16V26C16 24.5 15.5 23 14.5 21.5C14 21 13.5 20 13.5 18C13.5 14 16 11 20 11C24 11 26.5 14 26.5 18C26.5 20 26 21 25.5 21.5C24.5 23 24 24.5 24 26V28H28V26C28 25 28 24 28.5 23C29.5 21.5 30 20 30 18C30 12 26 8 20 8Z" fill="white" />
                  <circle cx="16" cy="16" r="2" fill="white" />
                  <circle cx="24" cy="16" r="2" fill="white" />
                </svg>
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to access your EleGuard dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link href="#" className="forgot-link">Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary login-btn">
                Sign In
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </button>
            </form>

            <div className="login-footer">
              <p>Don&apos;t have an account? <Link href="/register">Register Now</Link></p>
            </div>
          </div>

          <div className="login-visual">
            <div className="visual-content">
              <h2>Protect Your Farm 24/7</h2>
              <p>Access real-time alerts, monitor sensor status, and manage your fields from anywhere.</p>
              <div className="visual-features">
                <div className="visual-feature">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Real-time monitoring</span>
                </div>
                <div className="visual-feature">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Instant alerts</span>
                </div>
                <div className="visual-feature">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Field management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
