import "./StudentHome.css";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  House,
  RadioTower,
  CalendarDays,
  MessageSquarePlus,
  ArrowUpRight,
  ArrowLeftRight,
  X
} from 'lucide-react'
import './StudentHome.css'

const studentPages = [
  { label: 'Home', icon: House, path: '/student/home' },
  { label: 'Ongoing Events', icon: RadioTower, path: '/student/ongoing-events' },
  { label: 'Upcoming Events', icon: CalendarDays, path: '/student/upcoming-events' },
  { label: 'Suggestions & Requests', icon: MessageSquarePlus, path: '/student/requests' }
]

export default function StudentHome() {
  const navigate = useNavigate()
  const [showRequest, setShowRequest] = useState(false)
  const [category, setCategory] = useState('Resource Shortage')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const openPage = (path) => {
    if (path === '/student/requests') {
      setShowRequest(true)
      return
    }
    navigate(path)
  }

  const submitRequest = async (event) => {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      setMessage('Please complete all required fields.')
      return
    }

    // Grab active session details
    const studentName = sessionStorage.getItem("studentName") || "Student User"
    const userEmail = sessionStorage.getItem("userEmail") || "student@institute.edu"
    const collegeName = sessionStorage.getItem("collegeName") || "K J Somaiya Institute of Technology"
    const collegeId = sessionStorage.getItem("studentId") || sessionStorage.getItem("collegeId") || ""

    const newRequest = {
      studentName: studentName,
      email: userEmail,
      college: collegeName,
      collegeId: collegeId,
      category: category,
      subject: title.trim(),
      description: description.trim()
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest)
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setMessage('Success! Your request has been sent to your college tech team.')
        setTitle('')
        setDescription('')
      } else {
        setMessage('Error: ' + (data.message || 'Failed to submit request.'))
      }
    } catch (err) {
      setMessage('Error: Cannot connect to backend server on port 5000.')
    }
  }

  return (
    <div className="student-home">
      {/* HEADER */}
      <header className="student-home-header">
        <button
          className="student-home-logo"
          onClick={() => navigate('/student/home')}
        >
          OmniCampus<span>.</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            className="student-home-account"
            onClick={() => navigate('/choose-role')}
          >
            <ArrowLeftRight size={18} />
            Switch Role
          </button>

          <button
            type="button"
            className="student-home-account"
            onClick={() => navigate('/student/profile')}
          >
            My Account
            <ArrowUpRight size={18} />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="student-home-hero">
        <div className="student-home-hero-inner">
          <div className="student-home-kicker">
            <span />
            THE FUTURE OF CONNECTED EDUCATION
          </div>

          <h1>
            Different campuses.
            <br />
            <em>Shared possibilities.</em>
          </h1>

          <p>
            Discover events across institutions, stay connected
            with your campus, and help create a better learning
            environment for everyone.
          </p>

          <button
            className="student-home-explore"
            onClick={() => navigate('/student/ongoing-events')}
          >
            Explore Events
            <ArrowUpRight size={18} />
          </button>

          <div className="student-home-hero-footer">
            <span>BUILT FOR STUDENTS. DESIGNED FOR POSSIBILITIES.</span>
            <span>OMNICAMPUS</span>
          </div>
        </div>
      </section>

      {/* NAVIGATION TILES */}
      <section className="student-home-navigation">
        <div className="student-home-tiles">
          {studentPages.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              className="student-home-tile"
              onClick={() => openPage(path)}
            >
              <Icon size={25} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="student-home-footer">
        <span className="student-home-footer-logo">
          OmniCampus<span>.</span>
        </span>

        <span>Connecting students. Creating opportunities.</span>

        <span>© {new Date().getFullYear()} OmniCampus</span>
      </footer>

      {/* REQUEST FORM MODAL */}
      {showRequest && (
        <div
          className="student-request-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowRequest(false)
            }
          }}
        >
          <div
            className="student-request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-request-heading"
          >
            <div className="student-request-top">
              <div>
                <span>STUDENT SUPPORT</span>
                <h2 id="student-request-heading">
                  Suggestions & Requests
                </h2>
              </div>

              <button
                onClick={() => setShowRequest(false)}
                aria-label="Close request form"
              >
                <X size={21} />
              </button>
            </div>

            <p className="student-request-description">
              Report a resource shortage, share a suggestion,
              or raise an issue that your college should review.
            </p>

            <form onSubmit={submitRequest}>
              <label htmlFor="student-request-category">
                Request category
              </label>

              <select
                id="student-request-category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  setMessage('')
                }}
              >
                <option>Resource Shortage</option>
                <option>Laboratory Equipment</option>
                <option>Library Resources</option>
                <option>Classroom Facilities</option>
                <option>Campus Issue</option>
                <option>Suggestion</option>
                <option>Other</option>
              </select>

              <label htmlFor="student-request-title">
                Subject
              </label>

              <input
                id="student-request-title"
                type="text"
                placeholder="e.g. Additional lab computers required"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  setMessage('')
                }}
                maxLength={120}
                required
              />

              <label htmlFor="student-request-details">
                Description
              </label>

              <textarea
                id="student-request-details"
                placeholder="Describe the shortage, issue, or suggestion..."
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value)
                  setMessage('')
                }}
                rows={5}
                required
              />

              <button
                type="submit"
                className="student-request-submit"
              >
                Submit Request
                <ArrowUpRight size={18} />
              </button>

              {message && (
                <p className="student-request-message" role="status" style={{ color: message.startsWith('Success') ? '#059669' : 'inherit' }}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}