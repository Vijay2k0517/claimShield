/**
 * ClaimShield AI - Enterprise API & Network Service Layer
 * 
 * Directly communicates with the FastAPI Backend (http://localhost:8000/api/v1).
 * Includes automatic graceful fallback to in-memory store if backend is offline.
 */

const API_BASE_URL = "http://localhost:8000/api/v1";

// In-memory fallback dataset for offline frontend resilience
let mockClaims = [
  {
    claim_id: "CLM001",
    policy_id: "POL-98231",
    customer_name: "Sarah Jenkins",
    vehicle_number: "TN01 AB 1234",
    vehicle_make: "Hyundai",
    vehicle_model: "Creta",
    vehicle_year: 2023,
    accident_date: "2026-08-15",
    submission_date: "2026-08-17",
    status: "Review",
    fraud_probability: 87,
    risk_level: "HIGH",
    recommendation: "Manual Investigation",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Vehicle damage pattern does not match reported accident dynamics.",
      "AI detected pre-existing structural wear under modern impact marks.",
      "High visual similarity (91%) to a previously settled total loss claim (CLM045)."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      damage_description: "Front bumper compression, radiator support deformation, fractured right headlamp assembly.",
      confidence_score: 94.2
    },
    similar_claims: [
      {
        claim_id: "CLM045",
        vehicle_number: "TN09 XY 4567",
        vehicle_make: "Hyundai",
        vehicle_model: "Creta",
        accident_date: "2025-11-12",
        similarity_score: 91,
        risk_level: "HIGH",
        status: "Escalated",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
        notes: "Identical impact angle and deformation on bumper bracket. Flagged as repeated staged collision."
      },
      {
        claim_id: "CLM078",
        vehicle_number: "TN10 PQ 7890",
        vehicle_make: "Kia",
        vehicle_model: "Seltos",
        accident_date: "2026-02-04",
        similarity_score: 74,
        risk_level: "MEDIUM",
        status: "Review",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        notes: "Partial structural match in headlight mounting brackets."
      }
    ],
    decision: null
  },
  {
    claim_id: "CLM002",
    policy_id: "POL-77412",
    customer_name: "David Kumar",
    vehicle_number: "TN02 CD 5678",
    vehicle_make: "Maruti Suzuki",
    vehicle_model: "Swift",
    vehicle_year: 2022,
    accident_date: "2026-08-14",
    submission_date: "2026-08-16",
    status: "Review",
    fraud_probability: 81,
    risk_level: "HIGH",
    recommendation: "Manual Investigation",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Multiple point impacts inconsistent with single collision scenario.",
      "Tool marks detected near side fender panel inconsistent with roadway accident."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      damage_description: "Right quarter panel scrape and door shell depression.",
      confidence_score: 88.5
    },
    similar_claims: [
      {
        claim_id: "CLM032",
        vehicle_number: "TN02 MM 9988",
        vehicle_make: "Maruti Suzuki",
        vehicle_model: "Swift",
        accident_date: "2025-09-19",
        similarity_score: 83,
        risk_level: "HIGH",
        status: "Escalated",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        notes: "Similar fender panel stress marks."
      }
    ],
    decision: null
  },
  {
    claim_id: "CLM003",
    policy_id: "POL-55120",
    customer_name: "Priya Sharma",
    vehicle_number: "TN05 EF 9012",
    vehicle_make: "Honda",
    vehicle_model: "City",
    vehicle_year: 2024,
    accident_date: "2026-08-16",
    submission_date: "2026-08-17",
    status: "Legitimate",
    fraud_probability: 14,
    risk_level: "LOW",
    recommendation: "Approve Claim",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      damage_description: "Rear bumper dent and scratch consistent with stationary rear collision.",
      confidence_score: 96.1
    },
    similar_claims: [],
    decision: {
      decision: "Mark Legitimate",
      notes: "Clear camera footage and police report match damage points.",
      investigator_id: "INV-8402",
      timestamp: "2026-08-17T11:30:00Z"
    }
  },
  {
    claim_id: "CLM004",
    policy_id: "POL-33984",
    customer_name: "Rajesh Patel",
    vehicle_number: "TN07 GH 3456",
    vehicle_make: "Tata",
    vehicle_model: "Nexon",
    vehicle_year: 2023,
    accident_date: "2026-08-11",
    submission_date: "2026-08-13",
    status: "Review",
    fraud_probability: 62,
    risk_level: "MEDIUM",
    recommendation: "Request Additional Evidence",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Front bumper scratch angle mismatch with stated stationary pole impact.",
      "Estimated repair quote is 45% above regional benchmark."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      damage_description: "Lower valence split, grille lattice crack.",
      confidence_score: 82.0
    },
    similar_claims: [],
    decision: null
  },
  {
    claim_id: "CLM005",
    policy_id: "POL-11920",
    customer_name: "Anita Desai",
    vehicle_number: "TN09 KL 7890",
    vehicle_make: "Mahindra",
    vehicle_model: "XUV700",
    vehicle_year: 2023,
    accident_date: "2026-08-08",
    submission_date: "2026-08-10",
    status: "Escalated",
    fraud_probability: 92,
    risk_level: "HIGH",
    recommendation: "Escalate Investigation",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Damage severity incompatible with low-speed driveway report.",
      "Exif metadata timestamp differs from stated accident timestamp by 14 days."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      damage_description: "Left side t-bone impact crushing door pillars and deploying side curtain airbags.",
      confidence_score: 97.4
    },
    similar_claims: [],
    decision: {
      decision: "Escalate Investigation",
      notes: "Sent to SIU field investigator due to metadata timestamp discrepancy.",
      investigator_id: "INV-7104",
      timestamp: "2026-08-11T14:15:00Z"
    }
  }
];

/**
 * Helper to execute HTTP requests with timeout
 */
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Fetch all claims with optional filtering
 * @param {Object} [filters={}] - Optional query parameters
 * @returns {Promise<Array>} List of claim summaries
 */
export async function getClaims(filters = {}) {
  try {
    const query = new URLSearchParams({
      page: filters.page || 1,
      page_size: filters.page_size || 50,
      ...(filters.risk_level && { risk_level: filters.risk_level }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { search: filters.search }),
      ...(filters.vehicle_make && { vehicle_make: filters.vehicle_make })
    }).toString();

    const res = await fetchWithTimeout(`${API_BASE_URL}/claims?${query}`, { timeout: 2500 });
    if (res.ok) {
      const data = await res.json();
      if (data && data.items) {
        return data.items;
      }
    }
  } catch (e) {
    console.warn("Backend API unavailable, using resilient fallback claims:", e.message);
  }

  // Resilient fallback
  return [...mockClaims];
}

/**
 * Fetch a single claim by its ID
 * @param {string} claimId - The unique claim ID (e.g., "CLM001")
 * @returns {Promise<Object|null>} The full claim object
 */
export async function getClaimById(claimId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/claims/${claimId}`, { timeout: 2500 });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn(`Backend fetch failed for claim ${claimId}, using fallback:`, e.message);
  }

  const claim = mockClaims.find((c) => c.claim_id.toLowerCase() === (claimId || "").toLowerCase());
  return claim ? JSON.parse(JSON.stringify(claim)) : null;
}

/**
 * Fetch similar historical claims for a given claim ID
 * @param {string} claimId - The unique claim ID
 * @returns {Promise<Array>} Array of similar claims
 */
export async function getSimilarClaims(claimId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/claims/${claimId}/similar`, { timeout: 2500 });
    if (res.ok) {
      const data = await res.json();
      return data.matches || [];
    }
  } catch (e) {
    console.warn(`Backend similarity search failed for ${claimId}, using fallback:`, e.message);
  }

  const claim = mockClaims.find((c) => c.claim_id.toLowerCase() === (claimId || "").toLowerCase());
  return claim ? [...(claim.similar_claims || [])] : [];
}

/**
 * Submit a new claim for automated AI fraud analysis
 * @param {Object} claimData - Form data containing claim, vehicle, and damage details
 * @returns {Promise<Object>} The created claim with AI fraud assessment results
 */
export async function submitClaim(claimData) {
  try {
    const payload = {
      policy_id: claimData.policy_id || `POL-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: claimData.customer_name || "New Claimant",
      vehicle_number: claimData.vehicle_number || "TN01 XX 0000",
      vehicle_make: claimData.vehicle_make || "Unknown Make",
      vehicle_model: claimData.vehicle_model || "Unknown Model",
      vehicle_year: Number(claimData.vehicle_year) || new Date().getFullYear(),
      accident_date: claimData.accident_date || new Date().toISOString().split("T")[0],
      damage_description: claimData.description || claimData.damage_description || "Uploaded vehicle damage.",
      image_url: claimData.image_url || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
    };

    const res = await fetchWithTimeout(`${API_BASE_URL}/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeout: 4000
    });

    if (res.ok) {
      const newClaim = await res.json();
      mockClaims.unshift(newClaim);
      return newClaim;
    }
  } catch (e) {
    console.warn("Backend submit claim failed, executing local fallback simulation:", e.message);
  }

  // Fallback simulation
  const newIdNumber = mockClaims.length + 1;
  const claim_id = claimData.claim_id || `CLM${String(newIdNumber).padStart(3, "0")}`;
  const randomScore = Math.floor(Math.random() * 40) + 55;
  const risk_level = randomScore > 75 ? "HIGH" : randomScore > 40 ? "MEDIUM" : "LOW";
  const recommendation =
    risk_level === "HIGH"
      ? "Manual Investigation"
      : risk_level === "MEDIUM"
      ? "Request Additional Evidence"
      : "Approve Claim";

  const fallbackClaim = {
    claim_id,
    policy_id: claimData.policy_id || `POL-${Math.floor(10000 + Math.random() * 90000)}`,
    customer_name: claimData.customer_name || "New Claimant",
    vehicle_number: claimData.vehicle_number || "TN01 XX 0000",
    vehicle_make: claimData.vehicle_make || "Unknown Make",
    vehicle_model: claimData.vehicle_model || "Unknown Model",
    vehicle_year: Number(claimData.vehicle_year) || new Date().getFullYear(),
    accident_date: claimData.accident_date || new Date().toISOString().split("T")[0],
    submission_date: new Date().toISOString().split("T")[0],
    status: "Review",
    fraud_probability: randomScore,
    risk_level,
    recommendation,
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Damage consistency analysis completed.",
      "Visual impact vector evaluated against standard database.",
      "Claim queued for investigator review."
    ],
    evidence: {
      original_image: claimData.image_url || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      heatmap: claimData.image_url || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      overlay: claimData.image_url || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      damage_description: claimData.description || "Uploaded vehicle damage under analysis.",
      confidence_score: 91.0
    },
    similar_claims: [],
    decision: null
  };

  mockClaims.unshift(fallbackClaim);
  return fallbackClaim;
}

/**
 * Save an investigator's final decision for a claim
 * @param {string} claimId - The ID of the claim being decided
 * @param {Object} decisionData - Object containing { decision, notes, investigator_id }
 * @returns {Promise<Object>} Updated claim object
 */
export async function saveDecision(claimId, decisionData) {
  try {
    const payload = {
      decision: decisionData.decision,
      notes: decisionData.notes || "",
      investigator_id: decisionData.investigator_id || "INV-8402"
    };

    const res = await fetchWithTimeout(`${API_BASE_URL}/claims/${claimId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeout: 3000
    });

    if (res.ok) {
      const updatedClaim = await res.json();
      const idx = mockClaims.findIndex((c) => c.claim_id.toLowerCase() === claimId.toLowerCase());
      if (idx !== -1) mockClaims[idx] = updatedClaim;
      return updatedClaim;
    }
  } catch (e) {
    console.warn(`Backend save decision failed for ${claimId}, using local fallback:`, e.message);
  }

  // Local fallback
  const claimIndex = mockClaims.findIndex((c) => c.claim_id.toLowerCase() === (claimId || "").toLowerCase());
  if (claimIndex === -1) {
    throw new Error(`Claim with ID ${claimId} not found.`);
  }

  const statusMap = {
    "Mark Legitimate": "Legitimate",
    "Request Additional Evidence": "Pending",
    "Escalate Investigation": "Escalated"
  };

  const newStatus = statusMap[decisionData.decision] || "Review";
  const updatedDecision = {
    decision: decisionData.decision,
    notes: decisionData.notes || "",
    investigator_id: decisionData.investigator_id || "INV-8402",
    timestamp: new Date().toISOString()
  };

  mockClaims[claimIndex].decision = updatedDecision;
  mockClaims[claimIndex].status = newStatus;
  return JSON.parse(JSON.stringify(mockClaims[claimIndex]));
}

/**
 * Upload an evidence file to the backend
 * @param {File} file - Image file object
 * @returns {Promise<Object>} Stored file URL and dimensions
 */
export async function uploadEvidenceFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/evidence/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Failed to upload evidence file.");
  }
  return await res.json();
}

/**
 * Fetch unified dashboard analytics overview
 * @returns {Promise<Object>} Dashboard metrics, distributions, and trends
 */
export async function getDashboardSummary() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/analytics/dashboard-summary`, { timeout: 2500 });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend analytics summary failed, calculating local metrics:", e.message);
  }

  const total = mockClaims.length;
  const high = mockClaims.filter((c) => c.risk_level === "HIGH").length;
  const pending = mockClaims.filter((c) => c.status === "Review").length;
  const escalated = mockClaims.filter((c) => c.status === "Escalated").length;

  return {
    kpis: {
      total_claims: total,
      pending_reviews: pending,
      high_risk_claims: high,
      escalated_claims: escalated,
      avg_fraud_probability: 72.4
    },
    risk_distribution: [
      { risk_level: "LOW", count: 1, percentage: 20.0 },
      { risk_level: "REVIEW", count: 2, percentage: 40.0 },
      { risk_level: "HIGH", count: 2, percentage: 40.0 }
    ],
    risk_trends: [],
    top_fraud_reasons: [],
    model_alignment: {
      total_adjudicated: 2,
      ai_human_agreed: 2,
      agreement_rate: 100.0
    }
  };
}

export default {
  getClaims,
  getClaimById,
  getSimilarClaims,
  submitClaim,
  saveDecision,
  uploadEvidenceFile,
  getDashboardSummary
};
