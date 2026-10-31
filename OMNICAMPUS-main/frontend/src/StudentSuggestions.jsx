import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import './StudentSuggestions.css';

export default function StudentSuggestions() {
  const navigate = useNavigate();

  const [category, setCategory] = useState('Resource Shortage');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const collegeName = sessionStorage.getItem("collegeName") || "K J Somaiya Institute of Technology";
  const studentEmail = sessionStorage.getItem("userEmail") || "student@institute.edu";
  const studentName = sessionStorage.getItem("studentName") || "Student User";
  const collegeId = sessionStorage.getItem("studentId") || sessionStorage.getItem("collegeId") || "D-32";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subject.trim() || !description.trim()) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const newRequest = {
      studentName: studentName,
      email: studentEmail,
      college: collegeName,
      collegeId: collegeId,
      category: category,
      subject: subject.trim(),
      description: description.trim(),
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage("Success! Your request has been sent directly to your college tech team.");
        setSubject('');
        setDescription('');
      } else {
        setMessage("Error: " + (data.message || "Failed to submit request."));
      }
    } catch (err) {
      setMessage("Error: Cannot connect to backend server on port 5000.");
    }
  };

  return (
    <div className="student-suggestions-page">
      <header className="student-suggestions-header">
        <button type="button" className="student-suggestions-logo" onClick={() => navigate('/student/home')}>
          OmniCampus<span>.</span>
        </button>

        <button type="button" className="student-suggestions-back" onClick={() => navigate('/student/home')}>
          <ArrowLeft size={17} /> Back to Home
        </button>
      </header>

      <main className="student-suggestions-main">
        <div className="student-suggestions-heading">
          <span className="student-suggestions-kicker">
            | {collegeName.toUpperCase()} / STUDENT PORTAL
          </span>
          <h1>Suggestions <em>& Requests.</em></h1>
          <p>Report a resource shortage, share a suggestion, or raise an issue for your tech team to review.</p>
        </div>

        <form className="student-suggestions-card" onSubmit={handleSubmit}>
          <div className="student-suggestions-icon">
            <MessageSquare size={25} />
          </div>

          <label htmlFor="request-category">Request Category</label>
          <select 
            id="request-category"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="Resource Shortage">Resource Shortage</option>
            <option value="Facility Issue">Facility Issue</option>
            <option value="Academic Suggestion">Academic Suggestion</option>
            <option value="Event Proposal">Event Proposal</option>
          </select>

          <label htmlFor="request-subject">Subject</label>
          <input
            id="request-subject"
            type="text"
            placeholder="e.g. Chemistry book shortage in library"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />

          <label htmlFor="request-description">Description</label>
          <textarea
            id="request-description"
            placeholder="Describe your request or shortage details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />

          <button type="submit" className="student-signin-button" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
            <span>Submit Request</span>
            <Send size={17} />
          </button>

          {message && (
            <p className="student-suggestions-message" role="status" style={{ marginTop: '15px', fontWeight: '600', color: message.startsWith('Success') ? '#059669' : '#dc2626' }}>
              {message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}