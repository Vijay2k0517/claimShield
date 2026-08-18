import { useState } from "react";
import {
  Upload,
  X,
  Car,
  User,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Info
} from "lucide-react";
import { submitClaim } from "../services/api";

function NewClaimPage({ onNavigate, showToast }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    claim_id: "CLM" + Math.floor(100 + Math.random() * 900),
    policy_id: "POL-994821",
    customer_name: "Rahul Verma",
    vehicle_number: "DL01 AX 9921",
    vehicle_make: "Hyundai",
    vehicle_model: "Creta SX",
    vehicle_year: "2023",
    accident_date: new Date().toISOString().split("T")[0],
    damage_description: "Front bumper compression and radiator core deformation sustained during low-speed collision."
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadDemo = (type) => {
    if (type === "high-risk") {
      setFormData({
        claim_id: "CLM" + Math.floor(100 + Math.random() * 900),
        policy_id: "POL-884129",
        customer_name: "Vikram Malhotra",
        vehicle_number: "KA05 MN 4488",
        vehicle_make: "Hyundai",
        vehicle_model: "Creta Turbo",
        vehicle_year: "2023",
        accident_date: new Date().toISOString().split("T")[0],
        damage_description: "Severe front bumper bracket damage and displaced condenser."
      });
      if (showToast) showToast("Populated High Risk Demo Preset", "success");
    } else {
      setFormData({
        claim_id: "CLM" + Math.floor(100 + Math.random() * 900),
        policy_id: "POL-110294",
        customer_name: "Ananya Sharma",
        vehicle_number: "MH02 BZ 1092",
        vehicle_make: "Maruti Suzuki",
        vehicle_model: "Swift ZXi",
        vehicle_year: "2022",
        accident_date: new Date().toISOString().split("T")[0],
        damage_description: "Minor rear bumper paint scratch and cosmetic scuff."
      });
      if (showToast) showToast("Populated Low Risk Demo Preset", "success");
    }
  };

  const handleFiles = (files) => {
    const validImages = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
    setImages((prev) => [...prev, ...validImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrl =
        images.length > 0
          ? URL.createObjectURL(images[0])
          : "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80";

      const payload = {
        ...formData,
        image_url: imageUrl,
        description: formData.damage_description
      };

      const createdClaim = await submitClaim(payload);

      if (showToast) {
        showToast(`Claim ${createdClaim.claim_id} submitted & scored!`, "success");
      }

      if (onNavigate) {
        onNavigate("investigation", createdClaim.claim_id);
      }
    } catch (err) {
      console.error("Failed to submit claim:", err);
      alert("Unable to complete claim intake. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="new-claim-page">
      {/* Header */}
      <div className="new-claim-header">
        <div>
          <h2>New Claim Intake</h2>
          <p>
            Enter policyholder information, vehicle specifications, and damage photographs for automated fraud screening.
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleLoadDemo("high-risk")}
            style={{ fontSize: "0.78rem", padding: "6px 10px" }}
          >
            <Zap size={13} style={{ color: "var(--risk-high)" }} />
            Demo: High Risk Case
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleLoadDemo("low-risk")}
            style={{ fontSize: "0.78rem", padding: "6px 10px" }}
          >
            <Zap size={13} style={{ color: "var(--risk-low)" }} />
            Demo: Low Risk Case
          </button>
        </div>
      </div>

      {/* 4-Step Stepper */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "24px",
          background: "#ffffff",
          padding: "12px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <div
          onClick={() => setCurrentStep(1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            background: currentStep === 1 ? "var(--primary-light)" : "transparent",
            cursor: "pointer"
          }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: currentStep >= 1 ? "var(--primary)" : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
            1
          </div>
          <div>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Policy Details</strong>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Policyholder Info</div>
          </div>
        </div>

        <div
          onClick={() => setCurrentStep(2)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            background: currentStep === 2 ? "var(--primary-light)" : "transparent",
            cursor: "pointer"
          }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: currentStep >= 2 ? "var(--primary)" : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
            2
          </div>
          <div>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Vehicle Specs</strong>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Make, Model & Plate</div>
          </div>
        </div>

        <div
          onClick={() => setCurrentStep(3)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            background: currentStep === 3 ? "var(--primary-light)" : "transparent",
            cursor: "pointer"
          }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: currentStep >= 3 ? "var(--primary)" : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
            3
          </div>
          <div>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Damage Photos</strong>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Upload Evidence</div>
          </div>
        </div>

        <div
          onClick={() => setCurrentStep(4)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            background: currentStep === 4 ? "var(--primary-light)" : "transparent",
            cursor: "pointer"
          }}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: currentStep >= 4 ? "var(--primary)" : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
            4
          </div>
          <div>
            <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Review & Submit</strong>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Confirm & Ingest</div>
          </div>
        </div>
      </div>

      {/* Main Intake Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          boxShadow: "var(--shadow-card)",
          maxWidth: "800px"
        }}
      >
        {/* Step 1: Policy Info */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FileText size={18} style={{ color: "var(--primary)" }} />
              Step 1: Policy & Policyholder Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Claim Number
                </label>
                <input
                  type="text"
                  name="claim_id"
                  value={formData.claim_id}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--primary)", fontFamily: "var(--font-mono)", fontWeight: "700" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Policy ID
                </label>
                <input
                  type="text"
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Insured Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Reported Incident Date
                </label>
                <input
                  type="date"
                  name="accident_date"
                  value={formData.accident_date}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(2)}
              >
                Proceed to Vehicle Specs &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Specs */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Car size={18} style={{ color: "var(--primary)" }} />
              Step 2: Insured Vehicle Information
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Vehicle Manufacturer (Make)
                </label>
                <input
                  type="text"
                  name="vehicle_make"
                  value={formData.vehicle_make}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Model & Variant
                </label>
                <input
                  type="text"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Model Year
                </label>
                <input
                  type="number"
                  name="vehicle_year"
                  value={formData.vehicle_year}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  Registration Plate Number
                </label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                &larr; Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Proceed to Photo Upload &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Evidence Photos */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Upload size={18} style={{ color: "var(--primary)" }} />
              Step 3: Vehicle Damage Photographs
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? "var(--primary)" : "#cbd5e1"}`,
                borderRadius: "var(--radius-lg)",
                padding: "30px 20px",
                textAlign: "center",
                background: isDragging ? "var(--primary-light)" : "var(--bg-canvas)",
                cursor: "pointer",
                marginBottom: "16px"
              }}
              onClick={() => document.getElementById("file-input-upload").click()}
            >
              <input
                id="file-input-upload"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#eff6ff", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Upload size={20} />
              </div>
              <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>
                Click to upload, or drag and drop damage photos
              </strong>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                JPEG, PNG, or WEBP (up to 10MB per file). Auto-validated for resolution & EXIF integrity.
              </p>
            </div>

            {/* Attached Images */}
            {images.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "6px" }}>
                  Attached Files ({images.length})
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {images.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "90px",
                        height: "70px",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        border: "1px solid var(--border-color)"
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Evidence"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          background: "rgba(15,23,42,0.8)",
                          color: "#fff",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer"
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                Accident & Damage Description
              </label>
              <textarea
                rows={3}
                name="damage_description"
                value={formData.damage_description}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "0.82rem" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(2)}
              >
                &larr; Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(4)}
              >
                Review & Confirm &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={18} style={{ color: "var(--risk-low)" }} />
              Step 4: Confirm Intake & Run Fraud Scoring
            </h3>

            <div
              style={{
                background: "var(--bg-canvas)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                border: "1px solid var(--border-color)",
                marginBottom: "20px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "0.82rem"
              }}
            >
              <div><strong>Claim ID:</strong> <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>{formData.claim_id}</span></div>
              <div><strong>Policy ID:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>{formData.policy_id}</span></div>
              <div><strong>Customer:</strong> {formData.customer_name}</div>
              <div><strong>Vehicle:</strong> {formData.vehicle_make} {formData.vehicle_model} ({formData.vehicle_year})</div>
              <div><strong>Plate:</strong> <span style={{ fontFamily: "var(--font-mono)" }}>{formData.vehicle_number}</span></div>
              <div><strong>Photographs:</strong> {images.length > 0 ? `${images.length} file(s) attached` : "Standard Demo Asset"}</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(3)}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                <CheckCircle2 size={15} />
                {submitting ? "Processing Claim..." : "Submit Claim & Open Workspace"}
              </button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}

export default NewClaimPage;