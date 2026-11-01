import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2, MessageSquare } from "lucide-react";
import "./SuggestionsAndRequests.css";

export default function SuggestionsAndRequests() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("submit");
  const [suggestionType, setSuggestionType] = useState("suggestion");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [requestsList, setRequestsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentName = sessionStorage.getItem("studentName") || "Tech Admin";
  const userEmail = sessionStorage.getItem("userEmail") || "";
  const collegeName = sessionStorage.getItem("collegeName") || "OmniCampus Portal";

  useEffect(() => {
    if (activeTab === "view") {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
      const response = await fetch(`${rawUrl}/api/requests`);
      if (response.ok) {
        const data = await response.json();
        setRequestsList(data);
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedMessage("");

    if (!title || !description) {
      setSubmittedMessage("Error: Please fill in all required fields.");
      return;
    }

    const payload = {
      type: suggestionType,
      title,
      description,
      isAnonymous,
      author: isAnonymous ? "Anonymous User" : studentName,
      authorEmail: isAnonymous ? "" : userEmail,
      collegeName,
      createdAt: new Date().toISOString()
    };

    try {
      const rawUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
      const response = await fetch(`${rawUrl}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmittedMessage("Success: Your entry has been submitted successfully.");
        setTitle("");
        setDescription("");
      } else {
        const data = await response.json();
        setSubmittedMessage("Error: " + (data.message || "Submission failed."));
      }
    } catch (err) {
      setSubmittedMessage("Error: Cannot connect to server.");
    }
  };

  const handleBackNavigation = () => {
    if (sessionStorage.getItem("studentName")) {
      navigate("/student/home");
    } else {
      navigate("/");
    }
  };

  return (
    <main className="suggestions-page">
      <div className="suggestions-container">
        <header className="suggestions-header">
          <button 
            type="button" 
            className="suggestions-back-btn" 
            onClick={handleBackNavigation}
          >
            <ArrowLeft size={18} /> Back to Portal
          </button>
          
          <div className="suggestions-title-area">
            <h1>Suggestions &amp; Requests</h1>
            <p>Voice your thoughts or review submitted suggestions across the network.</p>
          </div>
        </header>

        <nav className="suggestions-tabs">
          <button 
            className={activeTab === "submit" ? "active" : ""} 
            onClick={() => setActiveTab("submit")}
          >
            Submit Entry
          </button>
          <button 
            className={activeTab === "view" ? "active" : ""} 
            onClick={() => setActiveTab("view")}
          >
            View Suggestions ({requestsList.length})
          </button>
        </nav>

        {activeTab === "submit" ? (
          <section className="suggestions-form-card">
            <form onSubmit={handleSubmit}>
              <div className="suggestions-type-selector">
                <label className={suggestionType === "suggestion" ? "selected" : ""}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="suggestion" 
                    checked={suggestionType === "suggestion"} 
                    onChange={() => setSuggestionType("suggestion")}
                  />
                  Campus Suggestion
                </label>

                <label className={suggestionType === "request" ? "selected" : ""}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="request" 
                    checked={suggestionType === "request"} 
                    onChange={() => setSuggestionType("request")}
                  />
                  Resource Request
                </label>
              </div>

              <div className="suggestions-field">
                <label htmlFor="sug-title">Subject / Title</label>
                <input 
                  id="sug-title"
                  type="text" 
                  placeholder="Enter request subject..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="suggestions-field">
                <label htmlFor="sug-desc">Detailed Description</label>
                <textarea 
                  id="sug-desc"
                  rows={5}
                  placeholder="Provide context or specific details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="suggestions-checkbox-field">
                <label>
                  <input 
                    type="checkbox" 
                    checked={isAnonymous} 
                    onChange={(e) => setIsAnonymous(e.target.checked)} 
                  />
                  Submit anonymously
                </label>
              </div>

              <button type="submit" className="suggestions-submit-btn">
                <Send size={18} /> Submit Request
              </button>

              {submittedMessage && (
                <div className={`suggestions-status-msg ${submittedMessage.startsWith("Error") ? "error" : "success"}`}>
                  {submittedMessage.startsWith("Success") && <CheckCircle2 size={18} />}
                  <span>{submittedMessage}</span>
                </div>
              )}
            </form>
          </section>
        ) : (
          <section className="suggestions-list-card">
            {loading ? (
              <p className="suggestions-empty">Loading entries...</p>
            ) : requestsList.length === 0 ? (
              <div className="suggestions-empty">
                <MessageSquare size={32} />
                <p>No suggestions or requests found.</p>
              </div>
            ) : (
              <div className="suggestions-grid">
                {requestsList.map((item, idx) => (
                  <article key={item.id || idx} className="suggestion-item">
                    <div className="suggestion-item-badge">{item.type}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="suggestion-item-footer">
                      <span>By: {item.author}</span>
                      <time>{new Date(item.createdAt).toLocaleDateString()}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}