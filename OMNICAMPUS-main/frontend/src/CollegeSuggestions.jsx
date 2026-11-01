import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, Building2 } from "lucide-react";
import "./CollegeSuggestions.css";

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
    <div className="college-suggestions-page">
      <header className="college-suggestions-header">
        <button className="college-suggestions-logo" onClick={() => navigate("/student/home")}>
          Omni<span>Campus</span>
        </button>
        <button className="college-suggestions-back" onClick={() => navigate("/student/home")}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      <main className="college-suggestions-main">
        <span className="college-suggestions-kicker">CAMPUS VOICE &amp; RESOURCES</span>
        <div className="college-suggestions-heading">
          <h1>Suggestions &amp; <em>Requests</em></h1>
          <p>Voice campus improvements, request facilities, or submit feedback directly to your college administration.</p>
        </div>

        <form onSubmit={handleSubmit} className="college-suggestions-card" style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "18px" }}>
            <MessageSquare size={20} color="#3568d4" /> New Submission
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1px solid #dce3ed", borderRadius: "8px", background: "#fbfcfe", color: "#0b1d3a", fontFamily: "inherit" }}
            >
              <option value="Suggestion">Campus Suggestion</option>
              <option value="Resource Request">Resource Request</option>
              <option value="Infrastructure">Infrastructure Issue</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Title</label>
            <input 
              type="text" 
              placeholder="Brief summary..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #dce3ed", borderRadius: "8px", background: "#fbfcfe", color: "#0b1d3a", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Description</label>
            <textarea 
              rows="4" 
              placeholder="Detailed explanation..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #dce3ed", borderRadius: "8px", background: "#fbfcfe", color: "#0b1d3a", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }}
            />
          </div>

          <button type="submit" disabled={submitting} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 20px", background: "#0b1d3a", color: "#fff", border: "0", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
            <Send size={16} /> {submitting ? "Submitting..." : "Submit Request"}
          </button>

          {message && (
            <p style={{ marginTop: "15px", color: message.startsWith("Error") ? "#ef4444" : "#198568", fontSize: "13px", fontWeight: "700" }}>
              {message}
            </p>
          )}
        </form>

        <div className="college-suggestions-section-heading">
          <h2>Recent Submissions ({requests.length})</h2>
          <span>{collegeName}</span>
        </div>

        <div className="college-suggestions-list">
          {requests.length === 0 ? (
            <div className="college-suggestions-empty">
              <h3>No submissions yet</h3>
              <p>Be the first to voice a suggestion or request for your college.</p>
            </div>
          ) : (
            requests.map((req, idx) => (
              <div key={req.id || idx} className="college-suggestions-card">
                <div className="college-suggestions-card-top">
                  <span className="college-suggestions-id">{req.type}</span>
                  <span className="college-suggestions-status">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 style={{ margin: "12px 0 8px", fontSize: "17px" }}>{req.title}</h3>
                <p className="college-suggestions-text">{req.description}</p>
                <div className="college-suggestions-card-bottom">
                  <span style={{ fontSize: "12px", color: "#64748b" }}>By: {req.author}</span>
                  <span style={{ fontSize: "12px", color: "#3568d4", fontWeight: "600" }}><Building2 size={13} style={{ display: "inline", marginRight: "4px" }} />{req.collegeName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="college-suggestions-footer">
        <strong>Omni<span>Campus</span></strong>
        <span>© {new Date().getFullYear()} OmniCampus. All rights reserved.</span>
      </footer>
    </div>
  );
}