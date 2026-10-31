import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './Home.jsx'
import Dashboard from './Dashboard.jsx'
import Resources from './Resources.jsx'
import ResourceDetails from './ResourceDetails.jsx'
import Account from './Account.jsx'
import Collaborations from './Collaborations.jsx'
import Earnings from './Earnings.jsx'
import RoleSelection from './RoleSelection.jsx'
import StudentLogin from './StudentLogin.jsx'
import StudentHome from './StudentHome.jsx'
import OngoingEvents from './OngoingEvents.jsx'
import UpcomingEvents from './UpcomingEvents.jsx'
import StudentSuggestions from './StudentSuggestions.jsx'
import EventRegistration from './EventRegistration.jsx'
import CollegeSuggestions from './CollegeSuggestions.jsx'
import StudentProfile from './StudentProfile.jsx'

import './App.css'

function App() {
  const navigate = useNavigate()

  const [showIntro, setShowIntro] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    code: '',
    location: '',
    address: '',
    phone: '',
    website: '',
    representative: '',
    designation: ''
  })

  const [message, setMessage] = useState('')
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 12
    })
  }

  const handleCollegeAuth = async (event) => {
    event.preventDefault()
    setMessage('')

    const emailLower = form.email.toLowerCase().trim()
    const personalDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@icloud.com']
    if (personalDomains.some((domain) => emailLower.endsWith(domain))) {
      setMessage('Error: Personal email addresses are blocked. Use your official college email.')
      return
    }

    try {
      if (!isRegistering) {
        const response = await fetch("http://localhost:5000/api/auth/college-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailLower, password: form.password })
        })

        const data = await response.json()

        if (response.status === 404 || data.needsRegistration) {
          setIsRegistering(true)
          setMessage('Institution not found in database. Please complete your college registration below.')
          return
        }

        if (!response.ok) {
          setMessage("Error: " + data.message)
          return
        }

        sessionStorage.setItem("collegeName", data.institution.name)
        sessionStorage.setItem("userEmail", data.institution.email)
        sessionStorage.setItem("collegeCode", data.institution.code)
        sessionStorage.setItem("collegeAddress", data.institution.address)
        localStorage.setItem("omnicampus-college-profile", JSON.stringify(data.institution))

        navigate('/home')
      } else {
        const response = await fetch("http://localhost:5000/api/auth/college-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: emailLower,
            password: form.password,
            code: form.code,
            location: form.location,
            address: form.address,
            phone: form.phone,
            website: form.website,
            representative: form.representative,
            designation: form.designation
          })
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage("Error: " + data.message)
          return
        }

        sessionStorage.setItem("collegeName", data.institution.name)
        sessionStorage.setItem("userEmail", data.institution.email)
        sessionStorage.setItem("collegeCode", data.institution.code)
        sessionStorage.setItem("collegeAddress", data.institution.address)
        localStorage.setItem("omnicampus-college-profile", JSON.stringify(data.institution))

        navigate('/home')
      }
    } catch (err) {
      setMessage('Error: Cannot connect to backend server on port 5000. Ensure node server.js is running.')
    }
  }

  const collegeLoginPage = (
    <main className="oc-login-page">
      <div className="oc-login-shell">
        <section
          className="oc-brand-panel"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        >
          <div className="oc-brand-header">
            <span className="oc-brand-name">OmniCampus</span>
            <span className="oc-brand-edition">INSTITUTIONAL NETWORK</span>
          </div>

          <div
            className="oc-visual"
            style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 500 360" className="oc-network" fill="none">
              <path d="M48 205 L160 105 L288 165 L420 68" className="oc-network-line" />
              <path d="M48 205 L175 280 L288 165 L445 280" className="oc-network-line" />
              <path d="M160 105 L175 280" className="oc-network-line oc-network-secondary" />
              <path d="M288 165 L445 280" className="oc-network-line oc-network-secondary" />
              <path d="M445 280 L420 68" className="oc-network-line oc-network-secondary" />

              <circle cx="48" cy="205" r="6" className="oc-node" />
              <circle cx="160" cy="105" r="6" className="oc-node" />
              <circle cx="175" cy="280" r="6" className="oc-node" />
              <circle cx="420" cy="68" r="6" className="oc-node" />
              <circle cx="445" cy="280" r="6" className="oc-node" />

              <circle cx="288" cy="165" r="22" className="oc-center-ring" />
              <circle cx="288" cy="165" r="7" className="oc-center-node" />
            </svg>
          </div>

          <div className="oc-brand-content">
            <div className="oc-section-index">
              <span className="oc-index-line" /> ONE CONNECTED PLATFORM
            </div>
            <h2>Better connections.<br /><em>Greater possibilities.</em></h2>
            <p>Bringing institutions together to share resources, collaborate on ideas, and create meaningful opportunities.</p>
          </div>

          <div className="oc-brand-footer">
            <span>CONNECT</span> <span className="oc-footer-dot" /> <span>SHARE</span> <span className="oc-footer-dot" /> <span>GROW</span>
          </div>
        </section>

        <section className="oc-form-panel">
          <div className="oc-form-top">
            <span>OMNICAMPUS PORTAL</span>
            <span className="oc-secure-indicator">
              <span className="oc-secure-dot" /> INSTITUTIONAL ACCESS
            </span>
          </div>

          <div className="oc-form-content">
            <div className="oc-form-intro">
              <span className="oc-form-kicker">YOUR INSTITUTIONAL WORKSPACE</span>
              <h1>{isRegistering ? <>Register <em>Institution.</em></> : <>Welcome <em>back.</em></>}</h1>
              <p>{isRegistering ? "Enter your official college details to register." : "Sign in to continue connecting with your institutional network."}</p>
            </div>

            <form onSubmit={handleCollegeAuth} className="oc-login-form">
              {isRegistering && (
                <>
                  <div className="oc-field">
                    <label>College Name</label>
                    <div className="oc-input-container">
                      <input
                        type="text"
                        placeholder="e.g. K J Somaiya Institute of Technology"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="oc-field">
                    <label>Institution Code</label>
                    <div className="oc-input-container">
                      <input
                        type="text"
                        placeholder="e.g. KJS-001"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="oc-field">
                    <label>Official Address & Location</label>
                    <div className="oc-input-container">
                      <input
                        type="text"
                        placeholder="e.g. Sion, Mumbai, Maharashtra"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="oc-field">
                    <label>Contact Number</label>
                    <div className="oc-input-container">
                      <input
                        type="tel"
                        placeholder="+91 90000 00000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="oc-field">
                <label htmlFor="oc-email">Institutional email</label>
                <div className="oc-input-container">
                  <input
                    id="oc-email"
                    type="email"
                    placeholder="name@institution.edu"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => {
                      setForm({ ...form, email: event.target.value })
                      setMessage('')
                    }}
                    required
                  />
                </div>
              </div>

              <div className="oc-field">
                <div className="oc-field-heading">
                  <label htmlFor="oc-password">Password</label>
                  {!isRegistering && (
                    <button
                      type="button"
                      className="oc-text-button"
                      onClick={() => setMessage('Forgot password recovery will be available when authentication is connected.')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="oc-input-container">
                  <input
                    id="oc-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(event) => {
                      setForm({ ...form, password: event.target.value })
                      setMessage('')
                    }}
                    required
                  />

                  <button
                    type="button"
                    className="oc-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="oc-signin-button">
                <span>{isRegistering ? "Complete Registration" : "Sign in to OmniCampus"}</span>
                <span className="oc-button-arrow">→</span>
              </button>

              {message && (
                <p className="oc-form-message" role="status">
                  {message}
                </p>
              )}
            </form>

            <div className="oc-register-section">
              {isRegistering ? (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    className="oc-register-link"
                    onClick={() => setIsRegistering(false)}
                  >
                    Sign in here ↗
                  </button>
                </p>
              ) : (
                <p>
                  Your institution isn't registered yet?{' '}
                  <button
                    type="button"
                    className="oc-register-link"
                    onClick={() => setIsRegistering(true)}
                  >
                    Register your institution ↗
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="oc-form-footer">
            <span>© {new Date().getFullYear()} OmniCampus</span>
            <span>Built for connected institutions</span>
          </div>
        </section>
      </div>
    </main>
  )

  return (
    <Routes>
      <Route
        path="/"
        element={
          showIntro ? (
            <div className="intro-screen">
              <div className="intro-brand">
                <h1 className="intro-title">
                  Omn
                  <span className="intro-letter-i">
                    ı
                    <span className="flying-book" aria-hidden="true">
                      <svg viewBox="0 0 40 32" width="40" height="32" fill="none">
                        <path d="M20 7 C14 2 7 3 2 5 V25 C9 23 15 24 20 28 Z" fill="white" stroke="#94A3B8" strokeWidth="1.2" />
                        <path d="M20 7 C26 2 33 3 38 5 V25 C31 23 25 24 20 28 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
                        <path d="M20 7 V28" stroke="#0B1D3A" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </span>
                  Campus
                </h1>
              </div>
            </div>
          ) : (
            <RoleSelection />
          )
        }
      />
      <Route path="/choose-role" element={<RoleSelection />} />
      <Route path="/college-login" element={collegeLoginPage} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:id" element={<ResourceDetails />} />
      <Route path="/account" element={<Account />} />
      <Route path="/events" element={<Collaborations />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/college/suggestions" element={<CollegeSuggestions />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/ongoing-events" element={<OngoingEvents />} />
      <Route path="/student/upcoming-events" element={<UpcomingEvents />} />
      <Route path="/student/requests" element={<StudentSuggestions />} />
      <Route path="/student/event-registration" element={<EventRegistration />} />
    </Routes>
  )
}

export default App