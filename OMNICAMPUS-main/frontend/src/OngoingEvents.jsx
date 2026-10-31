import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Building2,
  Clock3,
  Handshake
} from 'lucide-react'

import './OngoingEvents.css'

export default function OngoingEvents() {
  const navigate = useNavigate()

  const homeCollege = sessionStorage.getItem("collegeName") || "Edward College of Engineering"

  const collaborations = [
    {
      id: 1,
      name: 'TechNova 2026 — Inter-College Tech Fest',
      organizer: 'Kamothe Institute of Technology',
      partner: homeCollege,
      venue: 'Main Auditorium',
      address: 'Sector 21, Kamothe, Navi Mumbai',
      date: '31 October 2026',
      time: '10:00 AM – 5:00 PM'
    },
    {
      id: 2,
      name: 'RoboFusion — Robotics Workshop',
      organizer: homeCollege,
      partner: 'Panvel College of Engineering & Innovation',
      venue: 'Robotics Laboratory',
      address: 'New Panvel, Navi Mumbai',
      date: '31 October 2026',
      time: '11:00 AM – 4:00 PM'
    },
    {
      id: 3,
      name: 'CodeSphere — Collaborative Hackathon',
      organizer: 'Kharghar Institute of Advanced Studies',
      partner: homeCollege,
      venue: 'Innovation Centre',
      address: 'Sector 12, Kharghar, Navi Mumbai',
      date: '31 October 2026',
      time: '9:00 AM – 6:00 PM'
    },
    {
      id: 4,
      name: 'Creative Minds — Innovation Exhibition',
      organizer: homeCollege,
      partner: 'Navi Mumbai College of Arts & Technology',
      venue: 'Exhibition Hall',
      address: 'Sector 15, CBD Belapur, Navi Mumbai',
      date: '31 October 2026',
      time: '10:30 AM – 4:30 PM'
    },
    {
      id: 5,
      name: 'AI Nexus 2026 — Artificial Intelligence Workshop',
      organizer: homeCollege,
      partner: 'Panvel College of Engineering & Innovation',
      venue: `Main Seminar Hall, ${homeCollege}`,
      address: 'Parel, Mumbai',
      date: '31 October 2026',
      time: '10:00 AM – 3:30 PM'
    }
  ]

  return (
    <div className="ongoing-page">
      <header className="ongoing-header">
        <button
          type="button"
          className="ongoing-logo"
          onClick={() => navigate('/student/home')}
        >
          OmniCampus<span>.</span>
        </button>

        <button
          type="button"
          className="ongoing-back"
          onClick={() => navigate('/student/home')}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>
      </header>

      <main className="ongoing-main">
        <div className="ongoing-heading">
          <span className="ongoing-kicker">
            {homeCollege.toUpperCase()} / STUDENT PORTAL
          </span>

          <h1>
            Ongoing <em>Collaborations.</em>
          </h1>

          <p>
            Discover events organized by {homeCollege} in collaboration with partner institutions across Mumbai, Kamothe, Panvel, Kharghar and Navi Mumbai.
          </p>

          <small className="ongoing-demo-note">
            Active demonstration collaborations
          </small>
        </div>

        <div className="ongoing-event-list">
          {collaborations.map((event) => (
            <article className="ongoing-event-card" key={event.id}>
              <div className="ongoing-event-top">
                <span className="ongoing-live">
                  <span />
                  DEMO COLLABORATION
                </span>

                <h2>
                  <em>{event.name}</em>
                </h2>
              </div>

              <div className="ongoing-event-details">
                <div>
                  <Building2 size={18} />
                  <span>
                    <strong>Organized by:</strong> {event.organizer}
                  </span>
                </div>

                <div>
                  <Handshake size={18} />
                  <span>
                    <strong>In collaboration with:</strong> {event.partner}
                  </span>
                </div>

                <div>
                  <MapPin size={18} />
                  <span>
                    <strong>Venue:</strong> {event.venue}, {event.address}
                  </span>
                </div>

                <div>
                  <CalendarDays size={18} />
                  <span>
                    <strong>Date:</strong> {event.date}
                  </span>
                </div>

                <div>
                  <Clock3 size={18} />
                  <span>
                    <strong>Time:</strong> {event.time}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="ongoing-footer">
        <strong>
          OmniCampus<span>.</span>
        </strong>
        <span>Connecting students. Creating opportunities.</span>
        <span>© {new Date().getFullYear()} OmniCampus</span>
      </footer>
    </div>
  )
}