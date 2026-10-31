
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Building2,
  Handshake,
  MapPin
} from 'lucide-react'
import './UpcomingEvents.css'

const HOME_COLLEGE = 'Edward College of Engineering'

// Fictional demonstration events
const events = [
  {
    id: 1,
    title: 'FutureTech Summit 2026',
    type: 'collaboration',
    organizer: HOME_COLLEGE,
    partner: 'Kamothe Institute of Technology',
    venue: 'Main Auditorium, Edward College of Engineering',
    location: 'Parel, Mumbai',
    date: '2026-11-20',
    time: '10:00 AM – 5:00 PM'
  },
  {
    id: 2,
    title: 'Robotics Championship',
    type: 'individual',
    organizer: 'Panvel College of Engineering & Innovation',
    venue: 'Robotics Arena',
    location: 'New Panvel, Navi Mumbai',
    date: '2026-12-12',
    time: '9:30 AM – 4:30 PM'
  },
  {
    id: 3,
    title: 'CodeFest 2027 — Inter-College Hackathon',
    type: 'collaboration',
    organizer: 'Kharghar Institute of Advanced Studies',
    partner: HOME_COLLEGE,
    venue: 'Innovation Centre',
    location: 'Sector 12, Kharghar, Navi Mumbai',
    date: '2027-01-18',
    time: '9:00 AM – 6:00 PM'
  },
  {
    id: 4,
    title: 'Annual Cultural Fest 2027',
    type: 'individual',
    organizer: HOME_COLLEGE,
    venue: 'College Open Ground',
    location: 'Parel, Mumbai',
    date: '2027-02-14',
    time: '10:00 AM – 7:00 PM'
  },
  {
    id: 5,
    title: 'AI Innovation Expo',
    type: 'individual',
    organizer: 'Navi Mumbai College of Arts & Technology',
    venue: 'Exhibition Hall',
    location: 'Sector 15, CBD Belapur, Navi Mumbai',
    date: '2027-03-10',
    time: '10:30 AM – 5:00 PM'
  },
  {
    id: 6,
    title: 'Inter-College Sports Meet',
    type: 'collaboration',
    organizer: HOME_COLLEGE,
    partner: 'Panvel College of Engineering & Innovation',
    venue: 'Sports Complex',
    location: 'Kamothe, Navi Mumbai',
    date: '2027-04-16',
    time: '8:00 AM – 5:00 PM'
  }
]

// Parse dates as local calendar dates, avoiding UTC shifts
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(dateString) {
  return parseLocalDate(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function UpcomingEvents() {
  const navigate = useNavigate()

  const upcomingEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const endDate = new Date(today)
    endDate.setMonth(endDate.getMonth() + 6)

    return events
      .filter((event) => {
        const eventDate = parseLocalDate(event.date)
        return eventDate > today && eventDate <= endDate
      })
      .sort(
        (a, b) =>
          parseLocalDate(a.date) - parseLocalDate(b.date)
      )
  }, [])

  return (
    <div className="upcoming-page">

      {/* HEADER */}
      <header className="upcoming-header">
        <button
          type="button"
          className="upcoming-logo"
          onClick={() => navigate('/student/home')}
        >
          OmniCampus<span>.</span>
        </button>

        <button
          type="button"
          className="upcoming-back"
          onClick={() => navigate('/student/home')}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>
      </header>

      {/* MAIN */}
      <main className="upcoming-main">

        <div className="upcoming-heading">
          <span className="upcoming-kicker">
            EDWARD COLLEGE OF ENGINEERING / STUDENT PORTAL
          </span>

          <h1>
            Upcoming <em>Events.</em>
          </h1>

          <p>
            Discover individual college events and
            inter-college collaborations scheduled
            over the next six months.
          </p>

          <small className="upcoming-demo-note">
            Fictional demonstration events
          </small>
        </div>

        {/* EVENT CARDS */}
        {upcomingEvents.length > 0 ? (
          <div className="upcoming-event-list">

            {upcomingEvents.map((event) => (
              <article
                className="upcoming-event-card"
                key={event.id}
              >

                <div className="upcoming-event-top">
                  <span
                    className={
                      event.type === 'collaboration'
                        ? 'upcoming-tag collaboration'
                        : 'upcoming-tag individual'
                    }
                  >
                    {event.type === 'collaboration'
                      ? 'INTER-COLLEGE COLLABORATION'
                      : 'COLLEGE EVENT'}
                  </span>

                  <h2>
                    <em>{event.title}</em>
                  </h2>
                </div>

                <div className="upcoming-event-details">

                  <div>
                    <Building2 size={18} />
                    <span>
                      <strong>Organized by:</strong>{' '}
                      {event.organizer}
                    </span>
                  </div>

                  {event.type === 'collaboration' && (
                    <div>
                      <Handshake size={18} />
                      <span>
                        <strong>In collaboration with:</strong>{' '}
                        {event.partner}
                      </span>
                    </div>
                  )}

                  <div>
                    <MapPin size={18} />
                    <span>
                      <strong>Venue:</strong>{' '}
                      {event.venue}, {event.location}
                    </span>
                  </div>

                  <div>
                    <CalendarDays size={18} />
                    <span>
                      <strong>Date:</strong>{' '}
                      {formatDate(event.date)}
                    </span>
                  </div>

                  <div>
                    <Clock3 size={18} />
                    <span>
                      <strong>Time:</strong>{' '}
                      {event.time}
                    </span>
                  </div>

                </div>
              </article>
            ))}

          </div>
        ) : (
          <div className="upcoming-empty">
            <CalendarDays size={34} />
            <h2>No upcoming events scheduled</h2>
            <p>
              There are no demonstration events within
              the next six months. Check back later.
            </p>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="upcoming-footer">
        <strong>
          OmniCampus<span>.</span>
        </strong>

        <span>
          Connecting students. Creating opportunities.
        </span>

        <span>
          © {new Date().getFullYear()} OmniCampus
        </span>
      </footer>

    </div>
  )
}
