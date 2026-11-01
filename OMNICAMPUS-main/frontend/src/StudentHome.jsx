import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Compass,
  User,
  LogOut,
  Bell,
  BookOpen,
  Send
} from "lucide-react";
import "./Dashboard.css"; // Uses the exact same stylesheet as the Admin Dashboard

export default function StudentHome() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("Student");
  const [collegeName, setCollegeName] = useState("Institution");
  const [studentId, setStudentId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("studentName") || "Student";
    const college = sessionStorage.getItem("collegeName") || "Your Institution";
    const id = sessionStorage.getItem("studentId") || "STD-2026";

    setStudentName(name);
    setCollegeName(college);
    setStudentId(id);

    fetchRequests(college);
  }, []);

  const fetchRequests = async (college) => {
    setLoading(true);
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com").trim().replace(/\/+$/, "");
      const res = await fetch(`${rawUrl}/api/requests?college=${encodeURIComponent(college)}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/student/login");
  };

  const stats = [
    {
      label: "My Submissions",
      value: requests.filter((r) => r.author === studentName).length || requests.length,
      icon: MessageSquare,
    },
    {
      label: "Campus Requests",
      value: requests.length,
      icon: Boxes,
    },
    {
      label: "Account Status",
      value: "Verified",
      icon: CheckCircle2,
    },
    {
      label: "Network Status",
      value: "Active",
      icon: Clock3,
    },
  ];

  return (
    <div className="ocd-page">
      {/* Header matching Admin Dashboard */}
      <header className="ocd-header">
        <button className="ocd-logo" onClick={() => navigate("/student/home")}>
          Omni<span>Campus</span><b>.</b>
        </button>

        <div className="ocd-header-actions">
          <span className="ocd-header-label">STUDENT PORTAL</span>
          <button className="ocd-back" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="ocd-main">
        {/* Welcome Section */}
        <section className="ocd-welcome">
          <div>
            <span className="ocd-eyebrow">{collegeName.toUpperCase()}</span>
            <h1>
              Welcome back, <em>{studentName}</em>.
            </h1>
            <p>
              Your institutional student hub &amp; campus network portal. ID: {studentId}
            </p>
          </div>

          <button className="ocd-add-btn" onClick={() => navigate("/student/requests")}>
            <Send size={16} />
            New Suggestion
          </button>
        </section>

        {/* Overview Stats matching Admin Grid */}
        <section className="ocd-overview">
          <div className="ocd-section-title">
            <div>
              <span className="ocd-eyebrow">OVERVIEW</span>
              <h2>
                At a <em>glance.</em>
              </h2>
            </div>
          </div>

          <div className="ocd-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article className="ocd-stat" key={stat.label}>
                  <div className="ocd-stat-top">
                    <span>{stat.label}</span>
                    <Icon size={22} strokeWidth={1.7} />
                  </div>
                  <strong>{stat.value}</strong>
                </article>
              );
            })}
          </div>
        </section>

        {/* Workspace Grid Layout matching Admin Dashboard */}
        <div className="ocd-workspace-grid">
          {/* Quick Portals Panel */}
          <section className="ocd-panel">
            <div className="ocd-panel-heading">
              <div>
                <span className="ocd-eyebrow">STUDENT NAVIGATION</span>
                <h2>
                  Quick <em>Portals.</em>
                </h2>
              </div>
            </div>

            <div className="ocd-resource-list">
              <div 
                className="ocd-resource" 
                onClick={() => navigate("/student/requests")}
                style={{ cursor: "pointer" }}
              >
                <div className="ocd-resource-icon">
                  <MessageSquare size={20} />
                </div>
                <div className="ocd-resource-info">
                  <strong>Suggestions &amp; Requests</strong>
                  <span>Voice campus improvements &amp; submit resource requests</span>
                </div>
                <span className="ocd-status ocd-approved">Open</span>
              </div>

              <div 
                className="ocd-resource" 
                onClick={() => navigate("/student/upcoming-events")}
                style={{ cursor: "pointer" }}
              >
                <div className="ocd-resource-icon">
                  <Compass size={20} />
                </div>
                <div className="ocd-resource-info">
                  <strong>Campus Explorer</strong>
                  <span>Discover cross-institutional events, hackathons &amp; seminars</span>
                </div>
                <span className="ocd-status ocd-approved">Explore</span>
              </div>

              <div 
                className="ocd-resource" 
                onClick={() => navigate("/student/profile")}
                style={{ cursor: "pointer" }}
              >
                <div className="ocd-resource-icon">
                  <User size={20} />
                </div>
                <div className="ocd-resource-info">
                  <strong>Student Profile</strong>
                  <span>View &amp; manage your academic credentials and verified info</span>
                </div>
                <span className="ocd-status ocd-approved">View</span>
              </div>
            </div>
          </section>

          {/* Activity & Submissions Panel */}
          <section className="ocd-panel">
            <div className="ocd-panel-heading">
              <div>
                <span className="ocd-eyebrow">RECENT ACTIVITY</span>
                <h2>
                  Campus <em>Feed.</em>
                </h2>
              </div>
              <BookOpen size={22} className="ocd-heading-icon" />
            </div>

            <div className="ocd-request-list">
              {loading ? (
                <p className="ocd-empty">Loading campus feed...</p>
              ) : requests.length === 0 ? (
                <p className="ocd-empty">No recent activity recorded for {collegeName}.</p>
              ) : (
                requests.map((req, idx) => (
                  <div className="ocd-request" key={req.id || idx}>
                    <div className="ocd-request-top">
                      <div>
                        <strong>{req.title}</strong>
                        <span>By {req.author} • {req.type || "Suggestion"}</span>
                      </div>
                      <span className={`ocd-status ${req.status === "Approved" ? "ocd-approved" : req.status === "Rejected" ? "ocd-rejected" : "ocd-pending"}`}>
                        {req.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              className="ocd-text-link"
              onClick={() => navigate("/student/requests")}
            >
              View all submissions
              <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
      </main>

      {/* Footer matching Admin Dashboard */}
      <footer className="ocd-footer">
        <span className="ocd-footer-brand">OmniCampus.</span>
        <span>Connecting students &amp; institutions.</span>
        <span>© {new Date().getFullYear()} OmniCampus</span>
      </footer>
    </div>
  );
}