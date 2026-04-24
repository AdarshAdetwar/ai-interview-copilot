import { useState } from "react";
import api from "../api";
import {
  AiOutput,
  SkeletonLines,
  PageHeader,
  ScoreRing,
  PillChip,
  Spinner,
} from "../components/UI";

const SAMPLE_QS = [
  "Tell me about yourself",
  "What is your greatest weakness?",
  "Describe a challenging project you worked on",
  "Why do you want to work here?",
  "Where do you see yourself in 5 years?",
  "Tell me about a conflict with a coworker",
];

const TIPS = [
  { icon: "⭐", label: "Use the STAR method", desc: "Situation → Task → Action → Result" },
  { icon: "🎯", label: "Be specific", desc: "Concrete examples beat vague claims" },
  { icon: "📏", label: "Right length", desc: "Aim for 90–180 seconds when spoken" },
  { icon: "💬", label: "Stay positive", desc: "Even when discussing challenges" },
];

function Feedback() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");

  const getFeedback = async () => {
    if (!question.trim() || !answer.trim() || !role.trim() || loading) return;
    setLoading(true);
    setResult("");
    setScore(null);
    setError("");

    try {
      const res = await api.post("/interview/feedback", {
        question,
        answer,
        role,
        sessionId: localStorage.getItem("sessionId"),
      });

      const feedbackText = res.data.feedback || res.data;
      setResult(feedbackText);

      const numericScore =
        res.data.score != null
          ? res.data.score
          : (() => {
              const m =
                typeof feedbackText === "string"
                  ? feedbackText.match(/(\d{1,3})\s*(?:\/\s*10|%|out of 10)/i)
                  : null;
              return m ? parseInt(m[1]) : null;
            })();

      if (numericScore != null) {
        let s = numericScore;
        if (s <= 10) s = s * 10;
        setScore(Math.min(100, s));
      }
    } catch {
      setError("Unable to connect. Please ensure the backend is running.");
    }

    setLoading(false);
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const wordColor =
    wordCount === 0
      ? "#64728a"
      : wordCount < 50
      ? "#fb7185"
      : wordCount < 150
      ? "#fbbf24"
      : "#34d399";

  const wordLabel =
    wordCount === 0
      ? "0 words"
      : wordCount < 50
      ? `${wordCount} (too short)`
      : wordCount < 150
      ? `${wordCount} words`
      : `${wordCount} words ✓`;

  const scoreColor =
    !score ? "#64728a" : score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#fb7185";

  const scoreBadge =
    !score ? "" : score >= 80 ? "b-emerald" : score >= 60 ? "b-amber" : "b-rose";

  const scoreLabel =
    !score ? "" : score >= 80 ? "Strong Answer" : score >= 60 ? "Good with gaps" : "Needs work";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader
        badge="📊 Feedback"
        badgeClass="b-amber"
        title="Interview Answer Feedback"
        desc="Submit your answer and get AI-powered feedback and scoring."
      />

      <div className="cols-2">
        {/* LEFT */}
        <div className="glass" style={{ padding: 20 }}>
          <div className="section-label">
            <div className="ltext">Interview Question</div>
          </div>

          <textarea
            className="field field-amber"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter or paste the interview question here..."
            style={{ minHeight: 100 }}
          />

          <div style={{ marginTop: 16 }}>
            <div className="label">Interview role</div>
            <select
              className="field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select the target role</option>
              <option>Java Developer</option>
              <option>Frontend Developer</option>
              <option>Full Stack Engineer</option>
              <option>Product Manager</option>
            </select>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="t-xs" style={{ marginBottom: 6 }}>
              Sample questions:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SAMPLE_QS.map((q) => (
                <PillChip key={q} label={q} onClick={() => setQuestion(q)} />
              ))}
            </div>
          </div>

          <div className="glass" style={{ marginTop: 20, padding: 14 }}>
            <div className="t-h3" style={{ marginBottom: 8 }}>
              ✦ Answer Tips
            </div>
            {TIPS.map((t, i) => (
              <div key={i} className="t-sm">
                {t.icon} <strong>{t.label}:</strong> {t.desc}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="glass" style={{ padding: 20 }}>
          <div className="section-label">
            <div className="ltext">Your Answer</div>
            <span className="t-xs" style={{ color: wordColor }}>
              {wordLabel}
            </span>
          </div>

          <textarea
            className="field"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={`Write your answer here...

Use STAR:
• Situation
• Task
• Action
• Result`}
            style={{ minHeight: 260 }}
          />
        </div>
      </div>

      {/* BUTTON */}
      <div style={{ marginTop: 20 }}>
        <button
          className={`btn ${
            question && answer && !loading ? "btn-rose" : "btn-ghost"
          }`}
          onClick={getFeedback}
          disabled={!question || !answer || loading}
        >
          {loading ? <Spinner /> : "Get Feedback"}
        </button>
      </div>

      {/* RESULT */}
      {(result || loading) && (
        <div className="glass" style={{ marginTop: 20, padding: 20 }}>
          {loading ? (
            <SkeletonLines count={6} />
          ) : (
            <>
              {score && (
                <div style={{ marginBottom: 16 }}>
                  <ScoreRing score={score} color={scoreColor} />
                  <div className={`badge ${scoreBadge}`} style={{ marginTop: 8 }}>
                    {scoreLabel}
                  </div>
                </div>
              )}
              <AiOutput text={result} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Feedback;