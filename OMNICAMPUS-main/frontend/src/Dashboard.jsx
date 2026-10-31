
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  Activity,
  PackageCheck,
} from "lucide-react";
import "./Dashboard.css";

const initialResources = [
  {
    id: 1,
    name: "Seminar Hall",
    category: "Infrastructure",
    status: "Available",
  },
  {
    id: 2,
    name: "Computer Laboratory",
    category: "Laboratory",
    status: "Available",
  },
  {
    id: 3,
    name: "Projector & AV System",
    category: "Equipment",
    status: "Unavailable",
  },
];

const initialRequests = [
  {
    id: 1,
    resource: "Seminar Hall",
    college: "Edward College of Engineering, Parel",
    status: "Pending",
  },
  {
    id: 2,
    resource: "Computer Laboratory",
    college: "Westbridge Institute of Technology, Dadar",
    status: "Approved",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [resources, setResources] = useState(initialResources);
  const [requests, setRequests] = useState(initialRequests);
  const [activities, setActivities] = useState([
    "Seminar Hall request received",
    "Computer Laboratory request approved",
    "Projector & AV System listed",
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    status: "Available",
  });

  const totalResources = resources.length;

  const availableResources = resources.filter(
    (resource) => resource.status === "Available"
  ).length;

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const addActivity = (message) => {
    setActivities((previous) => [message, ...previous].slice(0, 5));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      status: "Available",
    });
    setShowForm(true);
  };

  const openEditForm = (resource) => {
    setEditingId(resource.id);
    setForm({
      name: resource.name,
      category: resource.category,
      status: resource.status,
    });
    setShowForm(true);
  };

  const saveResource = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const category = form.category.trim();

    if (!name || !category) return;

    if (editingId !== null) {
      setResources((previous) =>
        previous.map((resource) =>
          resource.id === editingId
            ? {
                ...resource,
                name,
                category,
                status: form.status,
              }
            : resource
        )
      );

      addActivity(`${name} updated`);
    } else {
      setResources((previous) => [
        ...previous,
        {
          id: Date.now(),
          name,
          category,
          status: form.status,
        },
      ]);

      addActivity(`${name} added`);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const deleteResource = (resource) => {
    if (!window.confirm(`Delete ${resource.name}?`)) return;

    setResources((previous) =>
      previous.filter((item) => item.id !== resource.id)
    );

    addActivity(`${resource.name} removed`);
  };

  const updateRequest = (id, status) => {
    const request = requests.find((item) => item.id === id);

    if (!request || request.status !== "Pending") return;

    setRequests((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    addActivity(
      `${request.resource} request ${status.toLowerCase()}`
    );
  };

  const stats = [
    {
      label: "Total Resources",
      value: totalResources,
      icon: Boxes,
    },
    {
      label: "Available Resources",
      value: availableResources,
      icon: PackageCheck,
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: Clock3,
    },
    {
      label: "Approved Requests",
      value: approvedRequests,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="ocd-page">
      <header className="ocd-header">
        <button
          className="ocd-logo"
          onClick={() => navigate("/home")}
        >
          Omni<span>Campus</span><b>.</b>
        </button>

        <div className="ocd-header-actions">
          <span className="ocd-header-label">
            INSTITUTIONAL DASHBOARD
          </span>

          <button
            className="ocd-back"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </header>

      <main className="ocd-main">
        <section className="ocd-welcome">
          <div>
            <span className="ocd-eyebrow">
              OMNICAMPUS / WORKSPACE
            </span>

            <h1>
              Campus <em>Dashboard.</em>
            </h1>

            <p>
              Manage your college resources and requests
              from one simple workspace.
            </p>
          </div>

          <button
            className="ocd-add-btn"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Resource
          </button>
        </section>

        <section className="ocd-overview">
          <div className="ocd-section-title">
            <div>
              <span className="ocd-eyebrow">
                OVERVIEW
              </span>

              <h2>
                At a <em>glance.</em>
              </h2>
            </div>
          </div>

          <div className="ocd-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  className="ocd-stat"
                  key={stat.label}
                >
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

        <div className="ocd-workspace-grid">
          <section className="ocd-panel">
            <div className="ocd-panel-heading">
              <div>
                <span className="ocd-eyebrow">
                  RESOURCE MANAGEMENT
                </span>

                <h2>
                  My <em>Resources.</em>
                </h2>
              </div>

              <button
                className="ocd-small-btn"
                onClick={openAddForm}
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="ocd-resource-list">
              {resources.length === 0 ? (
                <p className="ocd-empty">
                  No resources listed yet.
                </p>
              ) : (
                resources.map((resource) => (
                  <div
                    className="ocd-resource"
                    key={resource.id}
                  >
                    <div className="ocd-resource-icon">
                      <Boxes size={20} />
                    </div>

                    <div className="ocd-resource-info">
                      <strong>{resource.name}</strong>
                      <span>{resource.category}</span>
                    </div>

                    <span
                      className={`ocd-status ${
                        resource.status === "Available"
                          ? "ocd-approved"
                          : "ocd-unavailable"
                      }`}
                    >
                      {resource.status}
                    </span>

                    <div className="ocd-row-actions">
                      <button
                        title="Edit resource"
                        aria-label={`Edit ${resource.name}`}
                        onClick={() =>
                          openEditForm(resource)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete resource"
                        aria-label={`Delete ${resource.name}`}
                        onClick={() =>
                          deleteResource(resource)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              className="ocd-text-link"
              onClick={() => navigate("/resources")}
            >
              Browse all resources
              <ArrowUpRight size={16} />
            </button>
          </section>

          <section className="ocd-panel">
            <div className="ocd-panel-heading">
              <div>
                <span className="ocd-eyebrow">
                  INCOMING INQUIRIES
                </span>

                <h2>
                  Resource <em>Requests.</em>
                </h2>
              </div>

              <ClipboardList
                size={23}
                className="ocd-heading-icon"
              />
            </div>

            <div className="ocd-request-list">
              {requests.map((request) => (
                <div
                  className="ocd-request"
                  key={request.id}
                >
                  <div className="ocd-request-top">
                    <div>
                      <strong>{request.resource}</strong>
                      <span>{request.college}</span>
                    </div>

                    <span
                      className={`ocd-status ${
                        request.status === "Approved"
                          ? "ocd-approved"
                          : request.status === "Rejected"
                          ? "ocd-rejected"
                          : "ocd-pending"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {request.status === "Pending" && (
                    <div className="ocd-request-actions">
                      <button
                        className="ocd-approve-btn"
                        onClick={() =>
                          updateRequest(
                            request.id,
                            "Approved"
                          )
                        }
                      >
                        <CheckCircle2 size={15} />
                        Approve
                      </button>

                      <button
                        className="ocd-reject-btn"
                        onClick={() =>
                          updateRequest(
                            request.id,
                            "Rejected"
                          )
                        }
                      >
                        <X size={15} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="ocd-panel ocd-activity-panel">
          <div className="ocd-panel-heading">
            <div>
              <span className="ocd-eyebrow">
                LATEST UPDATES
              </span>

              <h2>
                Recent <em>Activity.</em>
              </h2>
            </div>

            <Activity
              size={22}
              className="ocd-heading-icon"
            />
          </div>

          <div className="ocd-activities">
            {activities.map((activity, index) => (
              <div
                className="ocd-activity"
                key={`${activity}-${index}`}
              >
                <span className="ocd-activity-dot" />
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ocd-footer">
        <span className="ocd-footer-brand">
          OmniCampus.
        </span>

        <span>
          Connecting institutions. Creating opportunities.
        </span>

        <span>
          © {new Date().getFullYear()} OmniCampus
        </span>
      </footer>

      {showForm && (
        <div
          className="ocd-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="ocd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ocd-modal-title"
          >
            <div className="ocd-modal-heading">
              <h2 id="ocd-modal-title">
                {editingId !== null
                  ? "Edit"
                  : "Add"}{" "}
                <em>Resource.</em>
              </h2>

              <button
                aria-label="Close"
                onClick={() => setShowForm(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveResource}>
              <label htmlFor="ocd-name">
                Resource Name
              </label>

              <input
                id="ocd-name"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                placeholder="e.g. Seminar Hall"
                required
              />

              <label htmlFor="ocd-category">
                Category
              </label>

              <input
                id="ocd-category"
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value,
                  })
                }
                placeholder="e.g. Infrastructure"
                required
              />

              <label htmlFor="ocd-status">
                Availability
              </label>

              <select
                id="ocd-status"
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value,
                  })
                }
              >
                <option value="Available">
                  Available
                </option>
                <option value="Unavailable">
                  Unavailable
                </option>
              </select>

              <div className="ocd-form-actions">
                <button
                  type="button"
                  className="ocd-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ocd-save-btn"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
