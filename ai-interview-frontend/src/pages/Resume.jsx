import { useState, useRef } from "react";
import api from "../api";
import { AiOutput, SkeletonLines, PageHeader, Spinner } from "../components/UI";

function Resume() {
  const [file, setFile]         = useState(null);
  const [result, setResult]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState("");
  const fileRef = useRef();

  const upload = async () => {
    if (!file || loading) return;
    setLoading(true); setResult(""); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/resume/analyze", fd);
      setResult(res.data);
    } catch {
      setError("Unable to reach the server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const fileSizeKb = file ? (file.size / 1024).toFixed(0) : null;

  return (
    <div data-testid="resume-page">
      <PageHeader
        badge="📄 Resume Analyzer"
        badgeClass="b-cyan"
        title="Analyze your resume"
        desc="Upload a PDF and get an ATS-aware report covering strengths, gaps, keyword coverage, and targeted rewrites."
      />

      <div className="cols-2">
        {/* Upload Panel */}
        <div className="glass fu" style={{ padding: 22 }}>
          <div className="section-label"><span className="ltext">Upload</span></div>

          <div
            className={`dropzone ${dragging ? "drag" : ""} ${file ? "has-file" : ""}`}
            onClick={() => !loading && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            data-testid="resume-dropzone"
          >
            <input
              ref={fileRef} type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              data-testid="resume-file-input"
            />
            {file ? (
              <div>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--cyan)", marginBottom: 4, wordBreak: "break-word" }}>
                  {file.name}
                </div>
                <div className="t-sm">{fileSizeKb} KB · tap to change</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "2rem", marginBottom: 10, opacity: 0.65 }}>📄</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "var(--ink-1)" }}>
                  Drop your resume here
                </div>
                <div className="t-sm">PDF only · or tap to browse</div>
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(125,211,252,0.04)", border: "1px solid rgba(125,211,252,0.13)",
            borderRadius: 12, padding: 16, margin: "16px 0",
          }}>
            <div className="t-xs" style={{ color: "var(--cyan)", marginBottom: 10 }}>What we check</div>
            {[
              "Technical strengths & skill signal",
              "ATS keyword coverage",
              "Weaknesses & red flags",
              "Bullet point improvement suggestions",
              "Competitive positioning score",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
                <span className="dot" style={{ background: "var(--cyan)", marginTop: 7 }} />
                <span className="t-sm">{item}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{
              background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.22)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: "0.8125rem", color: "#fda4af",
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className={`btn ${file && !loading ? "btn-primary" : "btn-ghost"}`}
            style={{ width: "100%", padding: 11 }}
            onClick={upload}
            disabled={!file || loading}
            data-testid="resume-analyze-btn"
          >
            {loading ? <><Spinner size={14} />&nbsp;Analyzing…</> : "Analyze resume →"}
          </button>

          {result && !loading && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", padding: 9, marginTop: 8, fontSize: 12 }}
              onClick={() => { setFile(null); setResult(""); setError(""); }}
              data-testid="resume-reset-btn"
            >
              ↺ Start over
            </button>
          )}
        </div>

        {/* Results Panel */}
        <div className="glass fu" style={{ padding: 24, display: (result || loading) ? "block" : "none" }}>
          {loading ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Spinner size={16} />
                <span className="t-sm">Analyzing your resume…</span>
              </div>
              <SkeletonLines count={7} widths={["85%","70%","80%","60%","75%","88%","65%"]} />
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <h2 className="t-h2">Analysis Report</h2>
                <span className="badge b-emerald">✓ Complete</span>
              </div>
              <div style={{ maxHeight: "58vh", overflowY: "auto", paddingRight: 6 }}>
                <AiOutput text={result} accentColor="#7dd3fc" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Resume;
