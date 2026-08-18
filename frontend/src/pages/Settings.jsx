import {
  User,
  Bell,
  Shield,
  Brain,
  Save,
} from "lucide-react";
import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Settings</h2>
          <p>
            Manage ClaimShield AI investigation and system preferences.
          </p>
        </div>

        <div>
          <button
            className="new-claim-btn"
            onClick={handleSave}
          >
            <Save size={16} />
            Save Changes
          </button>

          {saved && (
            <p
              style={{
                color: "#16a34a",
                fontSize: "12px",
                marginTop: "8px",
                textAlign: "right",
                fontWeight: "600",
              }}
            >
              ✓ Settings saved successfully
            </p>
          )}
        </div>
      </div>

      <section className="claim-form-card">
        <div className="form-section-title">
          <User size={20} />

          <div>
            <h3>Investigator Profile</h3>
            <p>Manage your investigator information.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Investigator ID</label>
            <input
              type="text"
              value="INV-8402"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Investigator Name</label>
            <input
              type="text"
              value="Insurance Investigator"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value="investigator@claimshield.ai"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value="Fraud Investigation Analyst"
              readOnly
            />
          </div>
        </div>
      </section>

      <section className="claim-form-card">
        <div className="form-section-title">
          <Bell size={20} />

          <div>
            <h3>Notifications</h3>
            <p>Control investigation alerts and notifications.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-row">
            <div>
              <strong>System Notifications</strong>
              <p>Receive updates about claim processing.</p>
            </div>

            <button
              className={`toggle ${notifications ? "active" : ""}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span></span>
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong>High Risk Claim Alerts</strong>
              <p>Get notified when a high-risk claim is detected.</p>
            </div>

            <button
              className={`toggle ${highRiskAlerts ? "active" : ""}`}
              onClick={() => setHighRiskAlerts(!highRiskAlerts)}
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>

      <section className="claim-form-card">
        <div className="form-section-title">
          <Brain size={20} />

          <div>
            <h3>AI Analysis Preferences</h3>
            <p>Configure automated claim analysis behaviour.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-row">
            <div>
              <strong>Automatic Claim Analysis</strong>
              <p>
                Automatically analyze newly submitted claims using AI.
              </p>
            </div>

            <button
              className={`toggle ${autoAnalysis ? "active" : ""}`}
              onClick={() => setAutoAnalysis(!autoAnalysis)}
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>

      <section className="claim-form-card">
        <div className="form-section-title">
          <Shield size={20} />

          <div>
            <h3>Security</h3>
            <p>Security and access information.</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-row">
            <div>
              <strong>Session Security</strong>
              <p>
                Investigator session protection is enabled.
              </p>
            </div>

            <span className="settings-status">
              Protected
            </span>
          </div>

          <div className="settings-row">
            <div>
              <strong>AI Service Connection</strong>
              <p>
                Connection to ClaimShield AI services.
              </p>
            </div>

            <span className="settings-status online">
              Online
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Settings;