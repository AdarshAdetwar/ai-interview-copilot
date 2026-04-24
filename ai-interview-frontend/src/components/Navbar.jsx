import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/resume",    label: "Resume" },
  { to: "/matcher",   label: "JD Matcher" },
  { to: "/interview", label: "Interview" },
  { to: "/chat",      label: "Assistant" },
  { to: "/feedback",  label: "Feedback" },
  { to: "/history",   label: "History" },
  { to: "/analysis",  label: "Analytics" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (to) => location.pathname.startsWith(to);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    navigate("/login");
  };

  return (
    <nav id="app-nav" className={scrolled ? "scrolled" : ""} data-testid="app-navbar">
      <div className="nav-brand" onClick={() => navigate("/dashboard")} data-testid="nav-brand">
        <div className="nav-logo">◆</div>
        <div>
          <div className="nav-title">Copilot</div>
          <div className="nav-sub">AI Interview Suite</div>
        </div>
      </div>

      <div className="nav-links hide-mob">
        {NAV_LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={`nav-link ${isActive(l.to) ? "active" : ""}`}
            data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g,"-")}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-right">
        <div className="ai-pill hide-mob">
          <span className="dot pulse-dot" style={{ background: "#34d399" }} />
          AI Online
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} data-testid="nav-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
