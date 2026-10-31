import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MessageSquare,
  Inbox,
  CalendarDays,
  CheckCircle2
} from 'lucide-react'

import './CollegeSuggestions.css'

export default function CollegeSuggestions() {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const collegeName = sessionStorage.getItem("collegeName") || "Edward College of Engineering"

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch requests from backend", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000); // Polling for real-time updates
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id, status) => {
    const updated = suggestions.map((item) =>
      item.id === id ? { ...item, status } : item
    )
    setSuggestions(updated)
  }

  const newCount = suggestions.filter(
    (item) => (item.status || 'New') === 'New'
  ).length

  const reviewedCount = suggestions.filter(
    (item) => item.status === 'Reviewed'
  ).length

  const resolvedCount = suggestions.filter(
    (item) => item.status === 'Resolved'
  ).length

  return (
    <div className="college-suggestions-page">
      <header className="college-suggestions-header">
        <button
          type="button"
          className="college-suggestions-logo"
          onClick={() => navigate('/student/home')}
        >
          OmniCampus<span>.</span>
        </button>

        <button
          type="button"
          className="college-suggestions-back"
          onClick={() => navigate('/student/home')}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>
      </header>

      <main className="college-suggestions-main">
        <div className="college-suggestions-heading">
          <span className="college-suggestions-kicker">
            {collegeName.toUpperCase()} / COLLEGE PORTAL
          </span>

          <h1>
            Student <em>Suggestions & Requests.</em>
          </h1>

          <p>
            Review resource shortages, suggestions, and issues submitted by students of your institution synced via backend.
          </p>
        </div>

        <div className="college-suggestions-stats">
          <div className="college-suggestions-stat">
            <MessageSquare size={22} />
            <strong>{suggestions.length}</strong>
            <span>Total Submissions</span>
          </div>

          <div className="college-suggestions-stat">
            <Inbox size={22} />
            <strong>{newCount}</strong>
            <span>New</span>
          </div>

          <div className="college-suggestions-stat">
            <CalendarDays size={22} />
            <strong>{reviewedCount}</strong>
            <span>Reviewed</span>
          </div>

          <div className="college-suggestions-stat">
            <CheckCircle2 size={22} />
            <strong>{resolvedCount}</strong>
            <span>Resolved</span>
          </div>
        </div>

        <section className="college-suggestions-section">
          <div className="college-suggestions-section-heading">
            <h2>Received Requests</h2>
            <span>{suggestions.length} submissions</span>
          </div>

          {loading ? (
            <div className="college-suggestions-empty">
              <p>Loading requests from backend...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="college-suggestions-empty">
              <Inbox size={38} />
              <h3>No requests received yet</h3>
              <p>
                Student suggestions submitted from the portal will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="college-suggestions-list">
              {suggestions.map((item) => (
                <article
                  key={item.id}
                  className="college-suggestions-card"
                >
                  <div className="college-suggestions-card-top">
                    <span className="college-suggestions-id">
                      {item.category || "General Request"} {item.collegeId ? `(ID: ${item.collegeId})` : ""}
                    </span>

                    <span className="college-suggestions-status">
                      {item.status || 'New'}
                    </span>
                  </div>

                  <h3>{item.subject}</h3>
                  <p className="college-suggestions-text">
                    {item.description}
                  </p>

                  <div className="college-suggestions-card-bottom">
                    <span className="college-suggestions-date">
                      <CalendarDays size={15} />
                      Submitted by: <strong>{item.studentName || "Student"}</strong> ({item.email}) at {item.timestamp || 'Today'}
                    </span>

                    <select
                      aria-label={`Status for suggestion ${item.id}`}
                      value={item.status || 'New'}
                      onChange={(event) =>
                        updateStatus(item.id, event.target.value)
                      }
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="college-suggestions-footer">
        <strong>OmniCampus<span>.</span></strong>
        <span>Connecting institutions. Creating opportunities.</span>
        <span>© {new Date().getFullYear()} OmniCampus</span>
      </footer>
    </div>
  )
}