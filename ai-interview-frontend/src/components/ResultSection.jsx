export default function ResultSection({ title, items, icon }) {
  return (
    <div className="glass" style={{ padding: 20, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <h3 className="t-h3">{title}</h3>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {items?.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: "var(--cyan)", marginTop: 3, fontSize: 12 }}>→</span>
            <span className="t-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}