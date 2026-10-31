
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Search,
  Handshake,
  CalendarDays,
  MapPin,
  Plus,
  X,
  Send,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import "./Collaborations.css";

const institutions = [
  {
    id: 1,
    name: "Northfield College of Engineering",
    location: "Andheri, Mumbai",
    type: "Engineering College",
    focus: "Technical workshops and resource sharing",
  },
  {
    id: 2,
    name: "Crestview Institute of Technology",
    location: "Powai, Mumbai",
    type: "Technology Institute",
    focus: "Research, AI and innovation",
  },
  {
    id: 3,
    name: "Westbridge Institute of Technology",
    location: "Dadar, Mumbai",
    type: "Technology Institute",
    focus: "Hackathons and technical events",
  },
  {
    id: 4,
    name: "Eastwood College of Engineering",
    location: "Matunga, Mumbai",
    type: "Engineering College",
    focus: "Academic seminars and joint programmes",
  },
];

const demoOpportunities = [
  {
    id: "demo-1",
    title: "Inter-College AI Workshop",
    institution: "Crestview Institute of Technology",
    category: "Workshop",
    description:
      "A collaborative workshop exploring artificial intelligence and its practical applications.",
    location: "Powai, Mumbai",
    date: "To be announced",
    image: "/images/ai-workshop.jpg",
  },
  {
    id: "demo-2",
    title: "Joint Innovation Hackathon",
    institution: "Westbridge Institute of Technology",
    category: "Hackathon",
    description:
      "An inter-college hackathon focused on developing innovative technology solutions.",
    location: "Dadar, Mumbai",
    date: "To be announced",
    image: "/images/hackathon.jpg",
  },
  {
    id: "demo-3",
    title: "Engineering Research Partnership",
    institution: "Northfield College of Engineering",
    category: "Research",
    description:
      "A joint research initiative connecting faculty and technical teams across institutions.",
    location: "Andheri, Mumbai",
    date: "To be announced",
    image: "/images/research.jpg",
  },
];

const demoInvitations = [
  {
    id: "invite-1",
    institution: "Crestview Institute of Technology",
    title: "Inter-College AI Workshop",
    category: "Workshop",
    status: "Pending",
  },
  {
    id: "invite-2",
    institution: "Westbridge Institute of Technology",
    title: "Joint Innovation Hackathon",
    category: "Hackathon",
    status: "Pending",
  },
];

const defaultForm = {
  title: "",
  category: "Workshop",
  description: "",
  location: "",
  date: "",
};

const INVITATIONS_KEY = "omnicampus-received-invitations";

function loadStored(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function loadInvitations() {
  try {
    const saved = localStorage.getItem(INVITATIONS_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (invitation) =>
              invitation &&
              typeof invitation === "object"
          )
          .map((invitation) => ({
            ...invitation,
            status:
              invitation.status === "Accepted" ||
              invitation.status === "Rejected"
                ? invitation.status
                : "Pending",
          }));
      }
    }
  } catch (error) {
    console.error("Unable to load invitations:", error);
  }

  return demoInvitations.map((invitation) => ({
    ...invitation,
  }));
}

function getCurrentCollege() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("omnicampus-college-profile") || "{}"
    );

    return (
      saved.name ||
      saved.institutionName ||
      "Edward College of Engineering"
    );
  } catch {
    return "Edward College of Engineering";
  }
}

export default function Collaborations() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("institutions");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState(() =>
    loadStored("omnicampus-collaboration-requests")
  );

  const [createdOpportunities, setCreatedOpportunities] = useState(() =>
    loadStored("omnicampus-collaboration-opportunities")
  );

  const [receivedInvitations, setReceivedInvitations] = useState(
    loadInvitations
  );

  const currentCollege = getCurrentCollege();

  const pendingInvitations = receivedInvitations.filter(
    (invitation) => invitation.status === "Pending"
  ).length;

  const filteredInstitutions = institutions.filter((institution) => {
    const value = search.toLowerCase();

    return (
      institution.name.toLowerCase().includes(value) ||
      institution.location.toLowerCase().includes(value) ||
      institution.focus.toLowerCase().includes(value)
    );
  });

  const opportunities = [
    ...createdOpportunities,
    ...demoOpportunities,
  ];

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const value = search.toLowerCase();

    return (
      opportunity.title.toLowerCase().includes(value) ||
      opportunity.institution.toLowerCase().includes(value) ||
      opportunity.category.toLowerCase().includes(value)
    );
  });

  const sendRequest = (institution) => {
    const alreadyRequested = requests.some(
      (request) =>
        request.institutionId === institution.id &&
        request.status === "Pending"
    );

    if (alreadyRequested) {
      setMessage(
        `You already have a pending request for ${institution.name}.`
      );
      return;
    }

    const request = {
      id: `request-${Date.now()}`,
      institutionId: institution.id,
      institutionName: institution.name,
      sender: currentCollege,
      status: "Pending",
      date: new Date().toLocaleDateString("en-IN"),
    };

    const updated = [request, ...requests];

    try {
      localStorage.setItem(
        "omnicampus-collaboration-requests",
        JSON.stringify(updated)
      );

      setRequests(updated);

      setMessage(
        `Collaboration request created for ${institution.name}.`
      );
    } catch {
      setMessage("Unable to save the request in this browser.");
    }
  };

  const respondToInvitation = (id, status) => {
    if (!["Accepted", "Rejected"].includes(status)) {
      return;
    }

    const invitation = receivedInvitations.find(
      (item) => item.id === id
    );

    if (!invitation || invitation.status !== "Pending") {
      return;
    }

    const updated = receivedInvitations.map((item) =>
      item.id === id
        ? { ...item, status }
        : item
    );

    try {
      localStorage.setItem(
        INVITATIONS_KEY,
        JSON.stringify(updated)
      );

      setReceivedInvitations(updated);

      setMessage(
        `Invitation from ${invitation.institution} ${status.toLowerCase()}.`
      );
    } catch {
      setMessage("Unable to save your invitation response.");
    }
  };

  const resetDemoInvitations = () => {
    const reset = demoInvitations.map((invitation) => ({
      ...invitation,
    }));

    try {
      localStorage.setItem(
        INVITATIONS_KEY,
        JSON.stringify(reset)
      );

      setReceivedInvitations(reset);
      setMessage("Demo invitations reset to Pending.");
    } catch {
      setMessage("Unable to reset demo invitations.");
    }
  };

  const createOpportunity = (event) => {
    event.preventDefault();

    const opportunity = {
      id: `opportunity-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location.trim(),
      date: form.date || "To be announced",
      institution: currentCollege,
    };

    const updated = [opportunity, ...createdOpportunities];

    try {
      localStorage.setItem(
        "omnicampus-collaboration-opportunities",
        JSON.stringify(updated)
      );

      setCreatedOpportunities(updated);
      setForm(defaultForm);
      setShowForm(false);
      setTab("opportunities");
      setSearch("");

      setMessage(
        "Collaboration opportunity published successfully."
      );
    } catch {
      setMessage("Unable to save the opportunity in this browser.");
    }
  };

  return (
    <div className="occ-page">
      <header className="occ-header">
        <div className="occ-header-inner">
          <button
            className="occ-logo"
            onClick={() => navigate("/home")}
          >
            Omni<span>Campus</span>.
          </button>

          <button
            className="occ-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>
        </div>
      </header>

      <main className="occ-main">
        <div className="occ-heading">
          <div>
            <span className="occ-eyebrow">
              OMNICAMPUS NETWORK
            </span>

            <h1>Collaborations</h1>

            <p>
              Connect with institutions, share ideas and
              create opportunities together.
            </p>
          </div>

          <button
            className="occ-primary"
            onClick={() => {
              setShowForm(true);
              setMessage("");
            }}
          >
            <Plus size={17} />
            Create Opportunity
          </button>
        </div>

        <section className="occ-hero">
          <div className="occ-hero-icon">
            <Handshake size={31} />
          </div>

          <div>
            <span>BUILDING STRONGER CONNECTIONS</span>

            <h2>One network. Endless possibilities.</h2>

            <p>
              Discover partner colleges, organize academic events
              and work together on meaningful initiatives.
            </p>
          </div>
        </section>

        {message && (
          <div className="occ-message" role="status">
            <CheckCircle2 size={18} />

            {message}

            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="occ-toolbar">
          <div className="occ-tabs">
            <button
              className={tab === "institutions" ? "active" : ""}
              onClick={() => {
                setTab("institutions");
                setSearch("");
              }}
            >
              Partner Institutions
            </button>

            <button
              className={tab === "opportunities" ? "active" : ""}
              onClick={() => {
                setTab("opportunities");
                setSearch("");
              }}
            >
              Opportunities
            </button>

            <button
              className={tab === "requests" ? "active" : ""}
              onClick={() => {
                setTab("requests");
                setSearch("");
              }}
            >
              My Requests ({requests.length})
            </button>

            <button
              className={tab === "received" ? "active" : ""}
              onClick={() => {
                setTab("received");
                setSearch("");
              }}
            >
              Received Invitations ({pendingInvitations})
            </button>
          </div>

          {tab !== "requests" && tab !== "received" && (
            <div className="occ-search">
              <Search size={18} />

              <input
                type="search"
                placeholder={
                  tab === "institutions"
                    ? "Search institutions..."
                    : "Search opportunities..."
                }
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          )}
        </div>

        {/* PARTNER INSTITUTIONS */}
        {tab === "institutions" && (
          <section>
            <div className="occ-section-heading">
              <h2>Find Partner Institutions</h2>

              <p>
                Explore colleges interested in academic partnerships.
              </p>
            </div>

            <div className="occ-grid">
              {filteredInstitutions.map((institution) => (
                <article
                  className="occ-card"
                  key={institution.id}
                >
                  <div className="occ-card-top">
                    <div className="occ-card-icon">
                      <Building2 size={24} />
                    </div>

                    <span className="occ-card-label">
                      {institution.type}
                    </span>
                  </div>

                  <h3>{institution.name}</h3>

                  <p className="occ-location">
                    <MapPin size={15} />
                    {institution.location}
                  </p>

                  <p className="occ-card-description">
                    {institution.focus}
                  </p>

                  <button
                    className="occ-card-button"
                    onClick={() =>
                      sendRequest(institution)
                    }
                  >
                    <Send size={15} />
                    Request Collaboration
                    <ArrowUpRight size={16} />
                  </button>
                </article>
              ))}
            </div>

            {filteredInstitutions.length === 0 && (
              <p className="occ-empty">
                No matching institutions found.
              </p>
            )}
          </section>
        )}

        {/* COLLABORATION OPPORTUNITIES */}
        {tab === "opportunities" && (
          <section>
            <div className="occ-section-heading">
              <h2>Collaboration Opportunities</h2>

              <p>
                Discover workshops, research initiatives and
                inter-college events.
              </p>
            </div>

            <div className="occ-grid">
              {filteredOpportunities.map((opportunity) => (
                <article
                  className={`occ-card ${
                    opportunity.image
                      ? "occ-opportunity-image-card"
                      : ""
                  }`}
                  key={opportunity.id}
                  style={
                    opportunity.image
                      ? {
                          backgroundImage: `linear-gradient(
                            rgba(11, 29, 58, 0.76),
                            rgba(11, 29, 58, 0.86)
                          ), url("${opportunity.image}")`,
                        }
                      : undefined
                  }
                >
                  <div className="occ-card-top">
                    <div className="occ-card-icon">
                      <CalendarDays size={24} />
                    </div>

                    <span className="occ-card-label">
                      {opportunity.category}
                    </span>
                  </div>

                  <h3>{opportunity.title}</h3>

                  <p className="occ-institution">
                    {opportunity.institution}
                  </p>

                  <p className="occ-card-description">
                    {opportunity.description}
                  </p>

                  <div className="occ-opportunity-meta">
                    <span>
                      <MapPin size={14} />
                      {opportunity.location}
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      {opportunity.date}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <p className="occ-empty">
                No matching opportunities found.
              </p>
            )}
          </section>
        )}

        {/* MY REQUESTS */}
        {tab === "requests" && (
          <section>
            <div className="occ-section-heading">
              <h2>My Collaboration Requests</h2>

              <p>
                Track the requests created by your institution.
              </p>
            </div>

            {requests.length === 0 ? (
              <div className="occ-empty-state">
                <Handshake size={35} />

                <h3>No collaboration requests yet</h3>

                <p>
                  Explore partner institutions to create your
                  first collaboration request.
                </p>

                <button
                  className="occ-primary"
                  onClick={() =>
                    setTab("institutions")
                  }
                >
                  Explore Institutions
                </button>
              </div>
            ) : (
              <div className="occ-request-list">
                {requests.map((request) => (
                  <div
                    className="occ-request"
                    key={request.id}
                  >
                    <div className="occ-request-icon">
                      <Building2 size={22} />
                    </div>

                    <div className="occ-request-info">
                      <h3>{request.institutionName}</h3>

                      <p>
                        Requested by {request.sender} ·{" "}
                        {request.date}
                      </p>
                    </div>

                    <span className="occ-pending">
                      <Clock3 size={14} />
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* RECEIVED INVITATIONS */}
        {tab === "received" && (
          <section>
            <div className="occ-section-heading">
              <h2>Received Invitations</h2>

              <p>
                Review collaboration invitations from other
                institutions and choose to accept or reject them.
              </p>
            </div>

            {receivedInvitations.length === 0 ? (
              <div className="occ-empty-state">
                <Handshake size={35} />

                <h3>No invitations received</h3>

                <p>
                  Collaboration invitations will appear here.
                </p>

                <button
                  type="button"
                  className="occ-primary"
                  onClick={resetDemoInvitations}
                >
                  Load Demo Invitations
                </button>
              </div>
            ) : (
              <>
                <div className="occ-request-list">
                  {receivedInvitations.map((invitation) => {
                    const isCompleted =
                      invitation.status === "Accepted" ||
                      invitation.status === "Rejected";

                    return (
                      <div
                        className="occ-request"
                        key={invitation.id}
                      >
                        <div className="occ-request-icon">
                          <Building2 size={22} />
                        </div>

                        <div className="occ-request-info">
                          <h3>{invitation.institution}</h3>

                          <p>
                            {invitation.title} ·{" "}
                            {invitation.category}
                          </p>
                        </div>

                        {!isCompleted ? (
                          <div className="occ-invitation-actions">
                            <button
                              type="button"
                              className="occ-accept-btn"
                              onClick={() =>
                                respondToInvitation(
                                  invitation.id,
                                  "Accepted"
                                )
                              }
                            >
                              Accept
                            </button>

                            <button
                              type="button"
                              className="occ-reject-btn"
                              onClick={() =>
                                respondToInvitation(
                                  invitation.id,
                                  "Rejected"
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={
                              invitation.status === "Accepted"
                                ? "occ-status-accepted"
                                : "occ-status-rejected"
                            }
                          >
                            {invitation.status}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    className="occ-secondary"
                    onClick={resetDemoInvitations}
                  >
                    Reset Demo Invitations
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        <div className="occ-demo-note">
          Demonstration institutions, opportunities and invitations
          are fictional. Requests and invitation responses are
          stored locally and are not yet sent to other colleges.
        </div>
      </main>

      {/* CREATE OPPORTUNITY MODAL */}
      {showForm && (
        <div
          className="occ-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="occ-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="occ-modal-title"
          >
            <div className="occ-modal-heading">
              <div>
                <span className="occ-eyebrow">
                  NEW COLLABORATION
                </span>

                <h2 id="occ-modal-title">
                  Create an Opportunity
                </h2>
              </div>

              <button
                className="occ-close"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={createOpportunity}>
              <label className="occ-field">
                Opportunity Title

                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. Joint Robotics Workshop"
                />
              </label>

              <label className="occ-field">
                Category

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                >
                  <option>Workshop</option>
                  <option>Hackathon</option>
                  <option>Seminar</option>
                  <option>Research</option>
                  <option>Joint Programme</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="occ-field">
                Description

                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe the collaboration opportunity..."
                />
              </label>

              <div className="occ-form-row">
                <label className="occ-field">
                  Location

                  <input
                    required
                    value={form.location}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        location: event.target.value,
                      })
                    }
                    placeholder="Mumbai, Maharashtra"
                  />
                </label>

                <label className="occ-field">
                  Date (Optional)

                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        date: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="occ-modal-actions">
                <button
                  type="button"
                  className="occ-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="occ-primary"
                >
                  <Plus size={17} />
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="occ-footer">
        <strong>OmniCampus.</strong>

        <span>
          Connecting institutions. Creating opportunities.
        </span>

        <span>
          © {new Date().getFullYear()} OmniCampus
        </span>
      </footer>
    </div>
  );
}
