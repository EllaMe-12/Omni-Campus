import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  User, 
  ArrowRight, 
  Bell,
  Compass
} from "lucide-react";
import "./StudentHome.css";

export default function StudentHome() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("Student");
  const [collegeName, setCollegeName] = useState("Institution");
  const [studentId, setStudentId] = useState("");
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("studentName");
    const college = sessionStorage.getItem("collegeName");
    const id = sessionStorage.getItem("studentId");

    if (name) setStudentName(name);
    if (college) setCollegeName(college);
    if (id) setStudentId(id);

    fetchCampusEvents(college);
  }, []);

  const fetchCampusEvents = async (college) => {
    setLoadingEvents(true);
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com").trim().replace(/\/+$/, "");
      const res = await fetch(`${rawUrl}/api/requests?college=${encodeURIComponent(college || "")}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/student/login");
  };

  return (
    <main className="student-home-page">
      <header className="student-top-nav">
        <div className="nav-brand">
          <span className="brand-title">OmniCampus</span>
          <span className="brand-subtitle">{collegeName}</span>
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" aria-label="Notifications"><Bell size={18} /></button>
          <button className="nav-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="student-dashboard-content">
        <section className="welcome-banner">
          <h1>Welcome back, <em>{studentName}</em>.</h1>
          <p>Your institutional workspace &amp; campus network hub. ID: {studentId || "Verified Student"}</p>
        </section>

        <h2 className="section-heading">Quick Navigation &amp; Portals</h2>
        
        <div className="horizontal-tiles-container">
          <div className="tile-card" onClick={() => navigate("/student/home")}>
            <div className="tile-icon"><Home size={24} /></div>
            <h3>Dashboard Home</h3>
            <p>Overview of your active sessions, announcements, and quick stats.</p>
            <span className="tile-action">Active <ArrowRight size={14} /></span>
          </div>

          <div className="tile-card" onClick={() => navigate("/suggestions")}>
            <div className="tile-icon"><MessageSquare size={24} /></div>
            <h3>Suggestions &amp; Requests</h3>
            <p>Voice campus improvements or submit resource requests anonymously.</p>
            <span className="tile-action">Open Portal <ArrowRight size={14} /></span>
          </div>

          <div className="tile-card" onClick={() => navigate("/campus-explorer")}>
            <div className="tile-icon"><Compass size={24} /></div>
            <h3>Campus Explorer</h3>
            <p>Discover cross-institutional events, hackathons, and seminars.</p>
            <span className="tile-action">Explore <ArrowRight size={14} /></span>
          </div>

          <div className="tile-card" onClick={() => navigate("/student/profile")}>
            <div className="tile-icon"><User size={24} /></div>
            <h3>Student Profile</h3>
            <p>Manage your academic credentials, verified email, and settings.</p>
            <span className="tile-action">View Profile <ArrowRight size={14} /></span>
          </div>
        </div>

        <section className="feed-section">
          <div className="feed-header">
            <h2>Recent Campus Activity</h2>
            <span>{events.length} Entries</span>
          </div>

          {loadingEvents ? (
            <p className="feed-status">Loading feed...</p>
          ) : events.length === 0 ? (
            <div className="feed-empty">
              <BookOpen size={28} />
              <p>No recent announcements or requests recorded for {collegeName}.</p>
            </div>
          ) : (
            <div className="horizontal-tiles-container feed-tiles">
              {events.map((ev, i) => (
                <div key={ev.id || i} className="tile-card feed-card">
                  <span className="badge">{ev.type || "Notice"}</span>
                  <h4>{ev.title}</h4>
                  <p>{ev.description}</p>
                  <div className="tile-footer">
                    <span>By: {ev.author}</span>
                    <time>{new Date(ev.createdAt).toLocaleDateString()}</time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}