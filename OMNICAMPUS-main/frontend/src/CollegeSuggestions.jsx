import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, X, MessageSquare, Building2, Clock3 } from "lucide-react";
import "./CollegeSuggestions.css";

export default function CollegeSuggestions() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const collegeName = sessionStorage.getItem("collegeName") || "Your Institution";

  useEffect(() => {
    fetchCollegeRequests();
  }, [collegeName]);

  const fetchCollegeRequests = async () => {
    setLoading(true);
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com").trim().replace(/\/+$/, "");
      const res = await fetch(`${rawUrl}/api/requests?college=${encodeURIComponent(collegeName)}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Error fetching college requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com").trim().replace(/\/+$/, "");
      // Update local state or call backend endpoint if available
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
      setMessage(`Request marked as ${newStatus}`);
    } catch (err) {
      setMessage("Error updating request status.");
    }
  };

  return (
    <div className="college-suggestions-page">
      <header className="college-suggestions-header">
        <button className="college-suggestions-logo" onClick={() => navigate("/home")}>
          Omni<span>Campus</span>
        </button>
        <button className="college-suggestions-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      <main className="college-suggestions-main">
        <span className="college-suggestions-kicker">ADMINISTRATION PORTAL</span>
        <div className="college-suggestions-heading">
          <h1>Student Suggestions &amp; <em>Requests</em></h1>
          <p>Review, evaluate, and manage facility or suggestion requests submitted by students of {collegeName}.</p>
        </div>

        <div className="college-suggestions-section-heading">
          <h2>Incoming Submissions ({requests.length})</h2>
          <span>{collegeName}</span>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="college-suggestions-empty">
            <MessageSquare size={32} />
            <h3>No student requests yet</h3>
            <p>When students submit feedback or resource requests from their portal, they will appear here for review.</p>
          </div>
        ) : (
          <div className="college-suggestions-list">
            {requests.map((req, idx) => (
              <div key={req.id || idx} className="college-suggestions-card">
                <div className="college-suggestions-card-top">
                  <span className="college-suggestions-id">{req.type || "Request"}</span>
                  <span className="college-suggestions-status" style={{ background: req.status === "Approved" ? "#e4f6ef" : req.status === "Rejected" ? "#fce9e9" : "#fff4df", color: req.status === "Approved" ? "#198568" : req.status === "Rejected" ? "#b34b4b" : "#a46a13" }}>
                    {req.status || "Pending Review"}
                  </span>
                </div>

                <h3 style={{ margin: "12px 0 8px", fontSize: "17px", color: "#0b1d3a" }}>{req.title}</h3>
                <p className="college-suggestions-text">{req.description}</p>

                <div className="college-suggestions-card-bottom" style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #e6eaf0" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Submitted by: <strong>{req.author || "Student"}</strong></span>
                  
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, "Approved")}
                      style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 14px", background: "#e4f6ef", color: "#198568", border: "0", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, "Rejected")}
                      style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 14px", background: "#fce9e9", color: "#b34b4b", border: "0", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <p style={{ marginTop: "20px", color: "#3568d4", fontSize: "13px", fontWeight: "700" }}>
            {message}
          </p>
        )}
      </main>

      <footer className="college-suggestions-footer">
        <strong>Omni<span>Campus</span></strong>
        <span>© {new Date().getFullYear()} OmniCampus Administration</span>
      </footer>
    </div>
  );
}