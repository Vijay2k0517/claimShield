import { useState } from "react";
import { ShieldAlert, ArrowRight, Lock, User } from "lucide-react";

/**
 * Login Page Component
 * Clean mock login portal for ClaimShield AI investigators.
 */
function Login({ onLogin }) {
  const [investigatorId, setInvestigatorId] = useState("INV-8402");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!investigatorId.trim() || !password.trim()) {
      setError("Please enter both Investigator ID and Password.");
      return;
    }

    // Mock authentication
    if (onLogin) {
      onLogin({
        id: investigatorId,
        name: "Investigator Sarah Chen",
        role: "Senior Claims Examiner",
        email: "s.chen@claimshield.ai"
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#111827",
            padding: "32px 24px",
            textAlign: "center",
            color: "white"
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#2563eb",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: "24px",
              fontWeight: "bold"
            }}
          >
            C
          </div>
          <h2 style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}>
            ClaimShield <span style={{ color: "#60a5fa" }}>AI</span>
          </h2>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>
            Insurance Fraud Detection & Investigation Platform
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "30px 24px" }}>
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                background: "#fee2e2",
                color: "#dc2626",
                borderRadius: "6px",
                fontSize: "12px",
                marginBottom: "16px"
              }}
            >
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#374151",
                marginBottom: "6px"
              }}
            >
              Investigator ID
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "7px",
                padding: "0 12px",
                height: "42px"
              }}
            >
              <User size={16} color="#6b7280" />
              <input
                type="text"
                value={investigatorId}
                onChange={(e) => setInvestigatorId(e.target.value)}
                placeholder="Enter investigator ID (e.g. INV-8402)"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "13px"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#374151",
                marginBottom: "6px"
              }}
            >
              Password
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "7px",
                padding: "0 12px",
                height: "42px"
              }}
            >
              <Lock size={16} color="#6b7280" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "13px"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "7px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <span>Sign In to Investigation Portal</span>
            <ArrowRight size={16} />
          </button>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
              fontSize: "11px",
              color: "#9ca3af"
            }}
          >
            Demo Credentials Preloaded • Secure System Access
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
