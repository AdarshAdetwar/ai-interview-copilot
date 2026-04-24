import { useState } from "react";
import api from "../api";
import { PageHeader, Spinner, AiOutput } from "../components/UI";

const ROLES = ["Java Developer", "Frontend Developer", "Full Stack Engineer", "Product Manager", "Data Scientist"];

function Interview() {
  const [question, setQuestion]     = useState("");
  const [answer, setAnswer]         = useState("");
  const [feedback, setFeedback]     = useState("");
  const [role, setRole]             = useState("Java Developer");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [sessionId, setSessionId]   = useState("");
  const [scores, setScores]         = useState([]);
  const [lastScore, setLastScore]   = useState(5);

  const handleGenerate = async () => {
    if (!role || !resumeText.trim()) { setError("Please select role and paste resume"); return; }
    setLoading(true); setError("");
    try {
      const res = await api.post("/interview/start", { role, resumeText });
      const sid = res.data.sessionId;
      setSessionId(sid);
      localStorage.setItem("sessionId", sid);
      setQuestion(res.data.question);
      setShowQuestions(true);
      setScores([]); setLastScore(5); setAnswer(""); setFeedback("");
    } catch (err) {
      console.error(err);
      setError("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) { alert("Write answer first"); return; }
    try {
      const res = await api.post("/interview/feedback", { answer, question, role, sessionId });
      setFeedback(res.data.feedback);
      setScores((prev) => [...prev, res.data.score]);
      setLastScore(res.data.score);
    } catch (err) { console.error(err); }
  };

  const handleNext = async () => {
    try {
      const res = await api.post("/interview/start", { role, resumeText, score: lastScore, sessionId });
      setQuestion(res.data.question);
      setAnswer(""); setFeedback("");
    } catch (err) { console.error(err); }
  };

  const total = 5;
  const done  = scores.length;
  const avgScore = done > 0 ? (scores.reduce((a, b) => a + b, 0) / done).toFixed(1) : null;

  return (
    <div data-testid="interview-page">
      <PageHeader
        badge="🎤 Mock Interview"
        badgeClass="b-emerald"
        title="Practice your interview"
        desc="Select a role, paste your resume, and get adaptive questions. Answer with STAR format and receive immediate scored feedback."
      />

      <div className="cols-2 fu" style={{ alignItems: "start" }}>

        {/* Config Panel */}
        <div className="glass" style={{ padding: 22 }}>
          <div className="section-label"><span className="ltext">Session Setup</span></div>

          <div style={{ marginBottom: 14 }}>
            <div className="t-xs" style={{ marginBottom: 7 }}>Target Role</div>
            <select
              className="field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              data-testid="interview-role-select"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="t-xs" style={{ marginBottom: 7 }}>Resume Context</div>
            <textarea
              className="field" rows="6"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text — questions will be grounded in your actual experience."
              data-testid="interview-resume-input"
            />
          </div>

          {/* Progress */}
          <div style={{ paddingTop: 14, borderTop: "1px solid var(--line)", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="t-xs">Progress</div>
              <div className="t-xs">{done} / {total} questions</div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {Array.from({ length: total }).map((_, i) => {
                const s = scores[i];
                const bg = s == null
                  ? "rgba(255,255,255,0.1)"
                  : s >= 8 ? "#6ee7b7" : s >= 6 ? "#fcd34d" : "#fda4af";
                return <div key={i} style={{ height: 5, borderRadius: 99, flex: 1, minWidth: 24, background: bg }} />;
              })}
            </div>
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
            className="btn btn-primary"
            style={{ width: "100%", padding: 11 }}
            onClick={handleGenerate}
            disabled={loading}
            data-testid="interview-start-btn"
          >
            {loading ? <><Spinner size={14} />&nbsp;Generating…</> : (showQuestions ? "Restart session" : "Generate first question →")}
          </button>
        </div>

        {/* Q&A Panel */}
        <div className="glass" style={{ padding: 24 }}>
          {!showQuestions ? (
            <div style={{ textAlign: "center", padding: "60px 12px" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10, opacity: 0.5 }}>🎤</div>
              <div className="t-h3" style={{ marginBottom: 6 }}>Session will appear here</div>
              <p className="t-sm">Fill out role and resume to generate your first question.</p>
            </div>
          ) : (
            <>
              <div className="section-label">
                <span className="ltext">Question</span>
                <span className="badge b-cyan">Q{done + 1}</span>
              </div>

              <div style={{
                background: "rgba(125,211,252,0.04)", border: "1px solid rgba(125,211,252,0.18)",
                borderRadius: 14, padding: "20px 22px", fontSize: "0.9375rem", lineHeight: 1.7,
                color: "var(--ink-1)", marginBottom: 20,
              }}>
                {question}
              </div>

              <div className="section-label" style={{ marginBottom: 12 }}>
                <span className="ltext">Your Answer</span>
              </div>
              <textarea
                className="field field-violet" rows="6"
                style={{ marginBottom: 14 }}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Structure with STAR: Situation → Task → Action → Result. Aim for 90–180 seconds spoken."
                data-testid="interview-answer-input"
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                <button className="btn btn-primary" onClick={handleSubmitAnswer} data-testid="interview-submit-btn">
                  Submit answer →
                </button>
                {feedback && (
                  <button className="btn btn-secondary" onClick={handleNext} data-testid="interview-next-btn">
                    Next question
                  </button>
                )}
              </div>

              {feedback && (
                <div className="fi" style={{
                  padding: 18, borderRadius: 14,
                  background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.18)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                      <svg width="56" height="56" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#6ee7b7" strokeWidth="5"
                                strokeLinecap="round" strokeDasharray="138.2"
                                strokeDashoffset={138.2 - (lastScore / 10) * 138.2}
                                transform="rotate(-90 28 28)" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="mono" style={{ fontSize: "1rem", fontWeight: 600, color: "#6ee7b7" }}>{lastScore}</span>
                      </div>
                    </div>
                    <div>
                      <div className="t-xs">Score</div>
                      <div className="t-sm" style={{ color: "#6ee7b7", marginTop: 3 }}>
                        {lastScore >= 8 ? "Excellent answer ✓" : lastScore >= 6 ? "Good — keep refining" : "Needs improvement"}
                      </div>
                    </div>
                  </div>
                  <AiOutput text={feedback} accentColor="#6ee7b7" />
                </div>
              )}

              {scores.length >= total && (
                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <div className="t-h2" style={{ color: "#6ee7b7" }}>🎉 Session complete</div>
                  <p className="t-sm" style={{ marginTop: 6 }}>Final average: <strong className="mono" style={{ color: "#fcd34d" }}>{avgScore} / 10</strong></p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;
