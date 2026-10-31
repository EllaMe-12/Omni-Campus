
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeftRight,
  House,
  LayoutDashboard,
  Boxes,
  Handshake,
  Wallet,
  MessageSquareText,
} from "lucide-react";
import "./Home.css";

const navigationTiles = [
  {
    title: "Home",
    icon: House,
    path: "/home",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Resources",
    icon: Boxes,
    path: "/resources",
  },
  {
    title: "Collaborations",
    icon: Handshake,
    path: "/events",
  },
  {
    title: "Earnings",
    icon: Wallet,
    path: "/earnings",
  },
  {
    title: "Student Suggestions",
    icon: MessageSquareText,
    path: "/college/suggestions",
  },
];

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("oc-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".oc-reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (path) => {
    if (path === "/home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    navigate(path);
  };

  return (
    <div className="oc-home">
      {/* HEADER */}
      <header className="oc-header">
        <div className="oc-header-inner">
          <button
            className="oc-logo"
            onClick={() => goTo("/home")}
            aria-label="OmniCampus Home"
          >
            Omni<span>Campus</span>
            <span className="oc-logo-dot">.</span>
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              className="oc-account"
              onClick={() => goTo("/choose-role")}
            >
              <ArrowLeftRight size={16} />
              Switch Role
            </button>

            <button
              type="button"
              className="oc-account"
              onClick={() => goTo("/account")}
            >
              My Account
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="oc-home-main">
        {/* HERO WITH BACKGROUND IMAGE */}
        <section className="oc-hero">
          <div className="oc-hero-content">
            <div className="oc-eyebrow oc-reveal">
              <span className="oc-eyebrow-line"></span>
              THE FUTURE OF CONNECTED EDUCATION
            </div>

            <h1 className="oc-hero-title oc-reveal">
              Different campuses.
              <br />
              <span>Shared possibilities.</span>
            </h1>

            <p className="oc-hero-description oc-reveal">
              Great things happen when institutions come together.
              Discover a smarter way to share resources, connect
              with colleges, and turn collaboration into progress.
            </p>

            <div className="oc-hero-actions oc-reveal">
              <button
                className="oc-primary-btn"
                onClick={() => goTo("/resources")}
              >
                Explore Resources
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>

          <div className="oc-hero-bottom">
            <span>
              BUILT FOR INSTITUTIONS. DESIGNED FOR POSSIBILITIES.
            </span>
            <span>OMNICAMPUS</span>
          </div>
        </section>

        {/* SIX NAVIGATION TILES */}
        <section
          className="oc-tile-section"
          aria-label="OmniCampus navigation"
        >
          <div className="oc-tile-container">
            <div className="oc-feature-grid">
              {navigationTiles.map((tile) => {
                const Icon = tile.icon;

                return (
                  <button
                    key={tile.title}
                    type="button"
                    className="oc-feature-tile"
                    onClick={() => goTo(tile.path)}
                  >
                    <Icon size={26} strokeWidth={1.8} />
                    <span>{tile.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="oc-footer">
        <span className="oc-footer-brand">
          OmniCampus.
        </span>

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
