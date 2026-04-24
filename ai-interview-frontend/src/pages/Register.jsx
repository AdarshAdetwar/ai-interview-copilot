import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed";

      setError(typeof msg === "string" ? msg : "Registration failed");
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
          Create account
        </h1>
        <p className="t-body" style={{ marginBottom: 20 }}>
          Start your interview prep journey.
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

        {/* Name */}
        <div className="floating-group">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field floating-input"
          />
          <label>Name</label>
        </div>

        {/* Email */}
        <div className="floating-group" style={{ marginTop: 14 }}>
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
          onClick={handleRegister}
          disabled={loading}
          className="btn btn-emerald"
          style={{ width: "100%", marginTop: 20 }}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        {/* Login Redirect */}
        <p className="t-sm" style={{ marginTop: 16, textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#7dd3fc", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;