import { useState, useRef, useEffect } from "react";
import api from "../api";
import { AiOutput, Spinner } from "../components/UI";

const SUGGESTIONS = [
  "How should I prepare for a system design interview?",
  "What's a good salary range for a mid-level Java developer?",
  "How do I explain a job gap in an interview?",
  "Tips for negotiating a job offer effectively",
  "What are the most common React interview questions?",
  "How to tailor my resume for ATS screening?",
];

function Message({ msg }) {
  const isUser = msg.type === "user";
  return (
    <div className="fade-in-up" style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      gap: "0.5rem", alignItems: "flex-end", marginBottom: "0.9rem",
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: "rgba(6,214,245,0.1)", border: "1px solid rgba(6,214,245,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.85rem",
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: "76%",
        padding: isUser ? "0.7rem 1rem" : "0.85rem 1.1rem",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser
          ? "linear-gradient(135deg, #06d6f5 0%, #38bdf8 100%)"
          : "rgba(255,255,255,0.05)",
        color: isUser ? "#050810" : "#e2e8f0",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.07)",
        fontSize: "0.875rem", lineHeight: 1.65,
        boxShadow: isUser ? "0 4px 16px rgba(6,214,245,0.2)" : "none",
      }}>
        {isUser ? msg.text : <AiOutput text={msg.text} accentColor="#06d6f5" />}
      </div>
      {isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 9, flexShrink: 0,
          background: "rgba(6,214,245,0.15)", border: "1px solid rgba(6,214,245,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem",
        }}>👤</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginBottom: "0.9rem" }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(6,214,245,0.1)", border: "1px solid rgba(6,214,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>🤖</div>
      <div style={{ padding: "0.75rem 1.1rem", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 180, 360].map((delay, i) => (
          <div key={i} className="pulse-dot" style={{
            width: 7, height: 7, borderRadius: "50%", background: "#06d6f5",
            animationDelay: `${delay}ms`,
          }} />
        ))}
      </div>
    </div>
  );
}

function Chat() {
  const [msg, setMsg]         = useState("");
  const [chat, setChat]       = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef   = useRef();
  const inputRef = useRef();
  const listRef  = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const send = async (text) => {
    const m = (text || msg).trim();
    if (!m || loading) return;
    setMsg("");
    setChat(prev => [...prev, { type: "user", text: m }]);
    setLoading(true);
    try {
      const res = await api.post("/ai/ask", { question: m });

      // BUG #6 FIX: Added type guard before rendering AI response.
      // res.data is unwrapped by the api.js interceptor and should be a string,
      // but if it's ever an object (e.g., an unexpected error shape), rendering
      // it directly would show "[object Object]". We safely coerce to string.
      const responseText = typeof res.data === "string"
        ? res.data
        : res.data?.message ?? JSON.stringify(res.data);

      setChat(prev => [...prev, { type: "ai", text: responseText }]);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data
        ? (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data))
        : "Server error. Try again.";
      setChat(prev => [...prev, { type: "ai", text: errMsg }]);
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.1rem", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13,
          background: "linear-gradient(135deg, rgba(6,214,245,0.15), rgba(56,189,248,0.08))",
          border: "1px solid rgba(6,214,245,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "'Space Grotesk', sans-serif" }}>AI Career Assistant</div>
          <div style={{ fontSize: "0.73rem", color: "#22c55e", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Online · Ready to help with your career
          </div>
        </div>
        {chat.length > 0 && (
          <button
            className="btn btn-ghost"
            style={{ marginLeft: "auto", padding: "0.4rem 0.85rem", fontSize: "0.78rem" }}
            onClick={() => setChat([])}
          >
            Clear chat
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div ref={listRef} style={{
        flex: 1, overflowY: "auto",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.065)",
        borderRadius: 16, padding: "1.25rem",
        marginBottom: "0.75rem",
        display: "flex", flexDirection: "column",
      }}>
        {chat.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>✨</div>
            <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
              Ask me anything about your career
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "1.75rem", maxWidth: 400, lineHeight: 1.7 }}>
              Interview prep, resume tips, salary insights, job hunting strategies — I'm here 24/7.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem", width: "100%", maxWidth: 520,
            }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  style={{
                    padding: "0.7rem 0.9rem", borderRadius: 10, textAlign: "left",
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                    color: "#94a3b8", fontSize: "0.78rem", cursor: "pointer", lineHeight: 1.5,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(6,214,245,0.05)"; e.currentTarget.style.borderColor = "rgba(6,214,245,0.2)"; e.currentTarget.style.color = "#e2e8f0"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          {chat.map((c, i) => <Message key={i} msg={c} />)}
          {loading && <TypingIndicator />}
          <div ref={endRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "0.65rem 0.65rem 0.65rem 1.1rem",
        display: "flex", gap: "0.6rem", alignItems: "flex-end",
        flexShrink: 0,
        boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
      }}>
        <textarea
          ref={inputRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask anything about your career…"
          rows={1}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#e2e8f0", fontSize: "0.9rem", lineHeight: 1.6,
            resize: "none", maxHeight: 140, overflowY: "auto",
            paddingTop: "0.15rem",
          }}
        />
        <button
          className={`btn ${msg.trim() && !loading ? "btn-cyan" : "btn-ghost"}`}
          onClick={() => send()}
          disabled={!msg.trim() || loading}
          style={{ padding: "0.6rem 1.2rem", alignSelf: "flex-end", flexShrink: 0 }}
        >
          {loading ? <Spinner size={15} /> : "Send"}
        </button>
      </div>
      <div style={{ textAlign: "center", fontSize: "0.68rem", color: "#374151", marginTop: "0.4rem" }}>
        Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}

export default Chat;