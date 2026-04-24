import { useNavigate } from "react-router-dom";

const FEATURES = [
  { title: "Resume Analyzer",    desc: "AI feedback on strengths, ATS score, and targeted rewrite suggestions.", icon: "📄", path: "/resume",    tile: "cyan",    badge: "Popular", badgeClass: "b-cyan",    kpi: "98% accuracy",   kpiColor: "var(--cyan)",   glow: "rgba(125,211,252,0.12)" },
  { title: "JD Matcher",         desc: "Match score + skill gap analysis before you apply to any role.",        icon: "🎯", path: "/matcher",   tile: "violet",  badge: "Hot",     badgeClass: "b-violet",  kpi: "Instant analysis", kpiColor: "var(--violet)", glow: "rgba(167,139,250,0.12)" },
  { title: "Mock Interview",     desc: "Role-specific questions grounded in your actual experience.",          icon: "🎤", path: "/interview", tile: "emerald", badge: "New",     badgeClass: "b-emerald", kpi: "Adaptive AI",     kpiColor: "#6ee7b7",       glow: "rgba(52,211,153,0.1)"   },
  { title: "AI Assistant",       desc: "Career advice, negotiation scripts, and strategy — on demand.",        icon: "💬", path: "/chat",      tile: "cyan",    badge: null,      badgeClass: "",          kpi: "24 / 7",          kpiColor: "var(--cyan)",   glow: "rgba(125,211,252,0.1)"  },
  { title: "Answer Feedback",    desc: "Submit any answer and get a scored critique with rewrites.",           icon: "📊", path: "/feedback",  tile: "amber",   badge: null,      badgeClass: "",          kpi: "Scored & ranked", kpiColor: "#fcd34d",       glow: "rgba(251,191,36,0.1)"   },
  { title: "History & Analytics",desc: "Track progress across sessions with trend charts and insights.",       icon: "📈", path: "/analysis",  tile: "violet",  badge: null,      badgeClass: "",          kpi: "Progress trends", kpiColor: "var(--violet)", glow: "rgba(167,139,250,0.1)"  },
];

const STATS = [
  { label: "Active Users",    value: "12K+", hint: "across 40 countries",    color: "var(--cyan)" },
  { label: "Resumes Scored",  value: "50K+", hint: "in the last 30 days",    color: "var(--violet)" },
  { label: "Mock Sessions",   value: "8.4K", hint: "completed this month",   color: "#6ee7b7" },
  { label: "Success Rate",    value: "94%",  hint: "offer conversion",       color: "#fcd34d" },
];

function FeatureCard({ f, onClick }) {
  return (
    <div className="glass glass-hover fu" onClick={onClick}
         style={{ padding: 22, position: "relative", overflow: "hidden" }}
         data-testid={`feature-card-${f.title.toLowerCase().replace(/\s+/g,"-")}`}>
      <div style={{
        position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${f.glow}, transparent 70%)`, pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div className={`icon-tile it-${f.tile}`}>{f.icon}</div>
        {f.badge && <span className={`badge ${f.badgeClass}`}>{f.badge}</span>}
      </div>
      <h3 className="t-h3" style={{ marginBottom: 6 }}>{f.title}</h3>
      <p className="t-sm" style={{ marginBottom: 20 }}>{f.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: f.kpiColor, fontWeight: 600 }}>{f.kpi}</span>
        <span style={{ color: f.kpiColor, fontSize: 18 }}>→</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div data-testid="dashboard-page">
      {/* ── Hero ── */}
      <section className="fu" style={{
        display: "grid", gridTemplateColumns: "1.25fr 0.75fr",
        gap: 32, marginBottom: 48, alignItems: "center",
      }}>
        <div>
          <div className="badge b-cyan" style={{ marginBottom: 18 }}>
            <span className="dot pulse-dot" style={{ background: "var(--cyan)" }} />
            AI-Powered Interview Preparation
          </div>
          <h1 className="t-display" style={{ marginBottom: 16 }}>
            Land your <span className="serif g-violet">dream role</span><br />
            with <span className="g-cyan">AI Copilot.</span>
          </h1>
          <p className="t-body" style={{ maxWidth: 500, marginBottom: 28 }}>
            Resume analysis, JD matching, adaptive mock interviews, and real-time scoring —
            one focused surface for your entire job search.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/resume")} data-testid="hero-analyze-btn">
              Analyze my resume →
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate("/interview")} data-testid="hero-interview-btn">
              Try a mock interview
            </button>
          </div>
        </div>

        {/* Ring card */}
        <div className="glass floaty" style={{ padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{
            content: '""', position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(125,211,252,0.14), transparent 70%)", pointerEvents: "none",
          }} />
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="dashRing" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#7dd3fc" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle cx="80" cy="80" r="66" fill="none" stroke="url(#dashRing)" strokeWidth="10"
                      strokeLinecap="round" strokeDasharray="414.7" strokeDashoffset="54"
                      transform="rotate(-90 80 80)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span className="mono" style={{ fontSize: "2rem", fontWeight: 600, color: "var(--cyan)", lineHeight: 1 }}>87</span>
              <span style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 2 }}>/ 100</span>
            </div>
          </div>
          <div className="t-xs" style={{ marginBottom: 6 }}>This Week's Readiness</div>
          <p className="t-sm" style={{ maxWidth: 200, margin: "0 auto" }}>
            Trending <span style={{ color: "#6ee7b7", fontWeight: 600 }}>+12%</span> from last week
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cols-4 stagger fu" style={{ marginBottom: 48 }}>
        {STATS.map((s) => (
          <div key={s.label} className="glass stat-card">
            <div className="t-xs" style={{ marginBottom: 8 }}>{s.label}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-hint">{s.hint}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <div className="rule" style={{ marginBottom: 24 }}><span className="t-xs">Everything you need</span></div>
      <div className="auto-fill stagger">
        {FEATURES.map((f) => <FeatureCard key={f.title} f={f} onClick={() => navigate(f.path)} />)}
      </div>

      {/* ── CTA ── */}
      <div className="glass fu" style={{
        marginTop: 48, padding: 32, textAlign: "center",
        background: "linear-gradient(135deg, rgba(125,211,252,0.07), rgba(167,139,250,0.055))",
        borderColor: "rgba(125,211,252,0.18)",
      }}>
        <h3 className="t-h2" style={{ marginBottom: 8 }}>Ready to ace your next interview?</h3>
        <p className="t-body" style={{ marginBottom: 22 }}>Start with a resume upload — we'll handle the rest.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => navigate("/resume")} data-testid="cta-get-started-btn">
            Get started, free
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/analysis")} data-testid="cta-view-analytics-btn">
            View analytics →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
