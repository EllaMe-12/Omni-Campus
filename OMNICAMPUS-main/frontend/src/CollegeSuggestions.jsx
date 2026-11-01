import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, CheckCircle2, Building2 } from "lucide-react";
import "./StudentHome.css";

export default function CollegeSuggestions() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Suggestion");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);

  const collegeName = sessionStorage.getItem("collegeName") || "Your Institution";
  const studentName = sessionStorage.getItem("studentName") || "Student";

  useEffect(() => {
    fetchRequests();
  }, [collegeName]);

  const fetchRequests = async () => {
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com").trim().replace(/\/+$/, "");
      const res = await fetch(`${rawUrl}/api/requests?college=${encodeURIComponent(collegeName)}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMessage("Error: Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "https://omni-campus-backend-e09d.onrender.com").trim().replace(/\/+$/, "");
      const res = await fetch(`${rawUrl}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          collegeName,
          author: studentName
        })
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setMessage("Success: Submitted successfully!");
        fetchRequests();
      } else {
        setMessage("Error: Failed to submit request.");
      }
    } catch (err) {
      setMessage("Error: Cannot connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="student-home-page">
      <header className="student-top-nav">
        <button className="nav-logout-btn" onClick={() => navigate("/student/home")}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="nav-brand" style={{ textAlign: "right" }}>
          <span className="brand-title">Suggestions &amp; Requests</span>
          <span className="brand-subtitle">{collegeName}</span>
        </div>
      </header>

      <div className="student-dashboard-content" style={{ maxWidth: "900px" }}>
        <section className="welcome-banner" style={{ marginBottom: "2rem" }}>
          <h1>Voice your <em>campus needs.</em></h1>
          <p>Submit resource requests, infrastructure feedback, or event suggestions directly to your college network.</p>
        </section>

        <form onSubmit={handleSubmit} className="tile-card" style={{ maxWidth: "100%", cursor: "default", marginBottom: "3rem", padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MessageSquare size={20} color="#d4af37" /> Create New Submission
          </h3>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Submission Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
            >
              <option value="Suggestion" style={{ background: "#090d16" }}>Campus Suggestion</option>
              <option value="Resource Request" style={{ background: "#090d16" }}>Resource Request</option>
              <option value="Infrastructure" style={{ background: "#090d16" }}>Infrastructure Issue</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Title</label>
            <input 
              type="text" 
              placeholder="Brief summary of your suggestion or request" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Description</label>
            <textarea 
              rows="4" 
              placeholder="Provide clear details..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", boxSizing: "border-box", resize: "vertical" }}
            />
          </div>

          <button type="submit" disabled={submitting} className="tile-action" style={{ background: "#d4af37", color: "#090d16", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <Send size={16} /> {submitting ? "Submitting..." : "Submit to College"}
          </button>

          {message && (
            <p style={{ marginTop: "1rem", color: message.startsWith("Error") ? "#ef4444" : "#059669", fontSize: "0.9rem" }}>
              {message}
            </p>
          )}
        </form>

        <h2 className="section-heading">Recent Submissions ({requests.length})</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {requests.length === 0 ? (
            <p style={{ color: "#64748b" }}>No submissions yet for {collegeName}.</p>
          ) : (
            requests.map((req, idx) => (
              <div key={req.id || idx} className="tile-card" style={{ maxWidth: "100%", cursor: "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span className="badge">{req.type}</span>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{req.title}</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1rem" }}>{req.description}</p>
                <div className="tile-footer">
                  <span>Submitted by: {req.author}</span>
                  <span style={{ color: "#d4af37" }}><Building2 size={14} style={{ display: "inline", marginRight: "4px" }} />{req.collegeName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}