// ─── Shared UI Components (Aurora Ink) ────────────────────────────────────────

export function SkeletonLines({ count = 5, widths }) {
  const defaults = ["90%","75%","85%","65%","80%"];
  const w = widths || defaults;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }} data-testid="skeleton-lines">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 12, width: w[i % w.length] }} />
      ))}
    </div>
  );
}

export function SectionHeader({ color = "#7dd3fc", children, extra }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span className="dot" style={{ background: color }} />
      <span className="label">{children}</span>
      {extra && <span className="t-xs">{extra}</span>}
    </div>
  );
}

export function PillChip({ label, active, color = "cyan", onClick }) {
  const palette = {
    cyan:   { bg: "rgba(125,211,252,0.12)", border: "rgba(125,211,252,0.3)", text: "#7dd3fc" },
    violet: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", text: "#c4b5fd" },
    amber:  { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  text: "#fcd34d" },
  };
  const c = palette[color] || palette.cyan;
  return (
    <button
      onClick={onClick}
      className="suggestion-chip"
      style={{
        background: active ? c.bg : undefined,
        borderColor: active ? c.border : undefined,
        color: active ? c.text : undefined,
      }}
    >
      {label}
    </button>
  );
}

export function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      {icon && <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.6 }}>{icon}</div>}
      <div className="t-h3" style={{ marginBottom: 6 }}>{title}</div>
      {desc && <p className="t-sm" style={{ maxWidth: 320, margin: "0 auto" }}>{desc}</p>}
    </div>
  );
}

export function ScoreRing({ score, size = 88, color = "#6ee7b7" }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="mono" style={{ fontSize: size > 80 ? "1.1rem" : "0.85rem", fontWeight: 600, color }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

export function StatChip({ label, value, color = "#7dd3fc" }) {
  return (
    <div className="glass stat-card">
      <div className="t-xs" style={{ marginBottom: 8 }}>{label}</div>
      <div className="stat-val" style={{ color }}>{value}</div>
    </div>
  );
}

export function IconBox({ icon, color = "cyan", size = 44 }) {
  return (
    <div className={`icon-tile it-${color === "purple" ? "violet" : color}`}
         style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {icon}
    </div>
  );
}

// Formatted AI response parser
export function AiOutput({ text, accentColor = "#7dd3fc" }) {
  if (!text) return null;
  const lines = String(text).split("\n");
  return (
    <div style={{ fontSize: "0.875rem", lineHeight: 1.75, color: "var(--ink-2)" }}>
      {lines.map((line, i) => {
        if (line.startsWith("## "))
          return <h2 key={i} style={{ fontSize: "1rem", fontWeight: 700, color: accentColor, margin: "1.3rem 0 0.5rem", paddingBottom: "0.4rem", borderBottom: `1px solid ${accentColor}22` }}>{line.replace(/^##\s/, "")}</h2>;
        if (line.startsWith("### "))
          return <h3 key={i} style={{ fontSize: "0.9rem", fontWeight: 700, color: accentColor, margin: "1rem 0 0.4rem" }}>{line.replace(/^###\s/, "")}</h3>;
        if (/^(\*\*|__)(.+?)(\*\*|__)$/.test(line.trim()))
          return <p key={i} style={{ color: "var(--ink-1)", fontWeight: 600 }}>{line.replace(/\*\*/g, "")}</p>;
        if (line.startsWith("- **")) {
          const bold = line.replace(/^-\s\*\*(.*?)\*\*.*/, "$1");
          const rest = line.replace(/^-\s\*\*.*?\*\*:?\s*/, "");
          return (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0" }}>
              <span style={{ color: accentColor, marginTop: 3, fontSize: 12 }}>→</span>
              <span><strong style={{ color: "var(--ink-1)" }}>{bold}:</strong> {rest}</span>
            </div>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0" }}>
              <span style={{ color: accentColor, marginTop: 3, fontSize: 12 }}>→</span>
              <span>{line.replace(/^[-*]\s/, "")}</span>
            </div>
          );
        if (/^\d+\./.test(line)) {
          const num = line.match(/^(\d+)\./)?.[1];
          const rest = line.replace(/^\d+\.\s*/, "");
          return (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0" }}>
              <span className="mono" style={{ color: accentColor, fontWeight: 600 }}>{num}.</span>
              <span>{rest}</span>
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
        return <p key={i} style={{ margin: "3px 0" }}>{line}</p>;
      })}
    </div>
  );
}

export function Spinner({ size = 18, color = "#7dd3fc" }) {
  return (
    <div className="spin-anim" style={{
      width: size, height: size, borderRadius: "50%",
      border: `2px solid ${color}33`, borderTopColor: color,
    }} />
  );
}

export function PageHeader({ badge, badgeClass = "b-cyan", title, desc, children }) {
  return (
    <div className="page-header fu">
      {badge && <div className="eyebrow"><span className={`badge ${badgeClass}`}>{badge}</span></div>}
      <h1 className="t-h1">{title}</h1>
      {desc && <p className="t-body" style={{ maxWidth: 560 }}>{desc}</p>}
      {children}
    </div>
  );
}