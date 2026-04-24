import { useState } from "react";
import api from "../api";
import { AiOutput, SkeletonLines, PageHeader, Spinner } from "../components/UI";

function wordCount(s) { return s.trim() ? s.trim().split(/\s+/).length : 0; }

function Matcher() {
  const [resume, setResume]   = useState("");
  const [jd, setJd]           = useState("");
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore]     = useState(null);
  const [error, setError]     = useState("");

  const match = async () => {
    if (!resume.trim() || !jd.trim() || loading) return;
    setLoading(true); setResult(""); setScore(null); setError("");
    try {
      const res = await api.post("/resume/match", { resumeText: resume, jobDescription: jd });
      const data = res.data;
      setResult(data);
      if (typeof data === "string") {
        const m = data.match(/(\d{1,3})\s*%/);
        if (m) setScore(Math.min(100, parseInt(m[1])));
      }
    } catch {
      setError("Unable to connect to the server. Please ensure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div data-testid="matcher-page">
      <PageHeader
        badge="🎯 JD Matcher"
        badgeClass="b-violet"
        title="Match your resume to a job"
        desc="Paste your resume and the job description to get a match score, keyword gap analysis, and targeted suggestions."
      />

      <div className="cols-2 fu" style={{ marginBottom: 20 }}>
        <div className="glass" style={{ padding: 20 }}>
          <div className="section-label">
            <span className="ltext">Your Resume</span>
            <span className="t-xs">{wordCount(resume)} words</span>
          </div>
          <textarea
            className="field" rows="9"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here — we'll ground the analysis in your experience."
            data-testid="matcher-resume-input"
          />
        </div>
        <div className="glass" style={{ padding: 20 }}>
          <div className="section-label">
            <span className="ltext">Job Description</span>
            <span className="t-xs">{wordCount(jd)} words</span>
          </div>
          <textarea
            className="field field-violet" rows="9"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the complete job description including requirements and responsibilities."
            data-testid="matcher-jd-input"
          />
        </div>
      </div>

      <button
        className={`btn ${resume && jd && !loading ? "btn-primary" : "btn-ghost"} fu`}
        style={{ marginBottom: 28 }}
        onClick={match}
        disabled={!resume.trim() || !jd.trim() || loading}
        data-testid="matcher-analyze-btn"
      >
        {loading ? <><Spinner size={14} color="#a78bfa" />&nbsp;Matching…</> : "Analyze match →"}
      </button>

      {error && (
        <div style={{
          background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.22)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.8125rem", color: "#fda4af",
        }}>
          ⚠️ {error}
        </div>
      )}

      {(result || loading) && (
        <div className="fu">
          {loading ? (
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Spinner size={16} color="#a78bfa" />
                <span className="t-sm">Comparing resume against job description…</span>
              </div>
              <SkeletonLines count={8} widths={["95%","70%","88%","55%","82%","75%","60%","90%"]} />
            </div>
          ) : (
            <div className="cols-2" style={{ marginBottom: 20 }}>
              {/* Score card */}
              <div className="glass" style={{
                padding: 24, textAlign: "center",
                background: "linear-gradient(175deg,rgba(125,211,252,0.07),rgba(167,139,250,0.05))",
                borderColor: "rgba(125,211,252,0.2)",
              }}>
                <div className="t-xs" style={{ marginBottom: 16 }}>Overall Match Score</div>
                <div className="mono g-cyan" style={{ fontSize: "3rem", fontWeight: 600, lineHeight: 1 }}>
                  {score != null ? `${score}%` : "—"}
                </div>
                <p className="t-sm" style={{ marginTop: 10, maxWidth: 220, marginLeft: "auto", marginRight: "auto" }}>
                  {score == null
                    ? "See the breakdown below for your full analysis."
                    : score >= 80 ? "Strong candidate — apply with confidence."
                    : score >= 60 ? "Strong candidate with a few targeted gaps to close before applying."
                    : "Significant gaps to close before applying."}
                </p>
              </div>

              {/* Analysis */}
              <div className="glass" style={{ padding: 22 }}>
                <h2 className="t-h2" style={{ marginBottom: 16 }}>Match Analysis</h2>
                <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
                  <AiOutput text={typeof result === "string" ? result : JSON.stringify(result)} accentColor="#a78bfa" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Matcher;