import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      const token =
        typeof res.data === "string" ? res.data : res.data?.token;

      if (!token) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;

      const msg =
        (data && typeof data === "object" && data.message) ||
        (typeof data === "string" && data) ||
        "Login failed. Please check credentials.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aurora-wrap flex items-center justify-center px-4">
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 380,
          padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="nav-logo">◆</div>
            <div>
              <div style={{ fontWeight: 700 }}>Copilot</div>
              <div className="t-xs">AI INTERVIEW SUITE</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="t-h1" style={{ marginBottom: 6 }}>
          Welcome back
        </h1>
        <p className="t-body" style={{ marginBottom: 20 }}>
          Sign in to continue your journey.
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(251,113,133,0.08)",
              border: "1px solid rgba(251,113,133,0.25)",
              padding: "8px 10px",
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 14,
              color: "#fda4af",
            }}
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div className="floating-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field floating-input"
          />
          <label>Email</label>
        </div>

        {/* Password */}
        <div className="floating-group" style={{ marginTop: 14 }}>
          <input
            type={showPass ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field floating-input"
          />
          <label>Password</label>

          {/* Toggle */}
          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: 14,
              color: "#94a3b8",
            }}
          >
            {showPass ? "🙈" : "👁"}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 20 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Register */}
        <p className="t-sm" style={{ marginTop: 16, textAlign: "center" }}>
          New here?{" "}
          <span
            style={{ color: "#7dd3fc", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;