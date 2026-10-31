
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ClipboardCheck
} from 'lucide-react'

import {
  getUpcomingEvents,
  formatEventDate
} from './upcomingEventsData.js'

import './EventRegistration.css'

export default function EventRegistration() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const events = getUpcomingEvents()
  const initialEventId = searchParams.get('event') || ''

  const [selectedEventId, setSelectedEventId] = useState(initialEventId)
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [message, setMessage] = useState('')

  const selectedEvent = events.find(
    (event) => String(event.id) === selectedEventId
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedEvent) {
      setMessage('Please select an upcoming event.')
      return
    }

    if (
      !studentName.trim() ||
      !studentEmail.trim() ||
      !rollNumber.trim()
    ) {
      setMessage('Please fill in all the fields.')
      return
    }

    setMessage(
      `Demo registration completed for ${selectedEvent.title}. ` +
      'Your registration will be saved once the backend is connected.'
    )

    setStudentName('')
    setStudentEmail('')
    setRollNumber('')
  }

  return (
    <div className="event-registration-page">

      <header className="event-registration-header">
        <button
          type="button"
          className="event-registration-logo"
          onClick={() => navigate('/student/home')}
        >
          OmniCampus<span>.</span>
        </button>

        <button
          type="button"
          className="event-registration-back"
          onClick={() => navigate('/student/home')}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>
      </header>

      <main className="event-registration-main">

        <div className="event-registration-heading">
          <span className="event-registration-kicker">
            EDWARD COLLEGE OF ENGINEERING / STUDENT PORTAL
          </span>

          <h1>
            Event <em>Registration.</em>
          </h1>

          <p>
            Choose an upcoming event and fill in your
            details to register your interest.
          </p>
        </div>

        <form
          className="event-registration-card"
          onSubmit={handleSubmit}
        >
          <div className="event-registration-icon">
            <ClipboardCheck size={26} />
          </div>

          <label htmlFor="registration-event">
            Select Upcoming Event
          </label>

          <select
            id="registration-event"
            value={selectedEventId}
            onChange={(event) => {
              setSelectedEventId(event.target.value)
              setMessage('')
            }}
            required
          >
            <option value="">Choose an event</option>

            {events.map((event) => (
              <option key={event.id} value={String(event.id)}>
                {event.title}
              </option>
            ))}
          </select>

          {selectedEvent && (
            <div className="event-registration-event-info">
              <p>
                <CalendarDays size={16} />
                {formatEventDate(selectedEvent.date)}
                {' · '}
                {selectedEvent.time}
              </p>

              <p>
                <MapPin size={16} />
                {selectedEvent.venue}, {selectedEvent.location}
              </p>
            </div>
          )}

          <label htmlFor="registration-name">
            Full Name
          </label>

          <input
            id="registration-name"
            type="text"
            placeholder="Enter your full name"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            required
          />

          <label htmlFor="registration-email">
            Email Address
          </label>

          <input
            id="registration-email"
            type="email"
            placeholder="Enter your email"
            value={studentEmail}
            onChange={(event) => setStudentEmail(event.target.value)}
            required
          />

          <label htmlFor="registration-roll">
            Roll Number
          </label>

          <input
            id="registration-roll"
            type="text"
            placeholder="Enter your roll number"
            value={rollNumber}
            onChange={(event) => setRollNumber(event.target.value)}
            required
          />

          <button
            type="submit"
            className="event-registration-submit"
          >
            Register for Event
            <ClipboardCheck size={18} />
          </button>

          {message && (
            <p className="event-registration-message" role="status">
              {message}
            </p>
          )}
        </form>

      </main>

      <footer className="event-registration-footer">
        <strong>OmniCampus<span>.</span></strong>
        <span>Connecting students. Creating opportunities.</span>
        <span>© {new Date().getFullYear()} OmniCampus</span>
      </footer>
    </div>
  )
}
