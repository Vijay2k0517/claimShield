/**
 * ClaimShield AI - API & Mock Data Service Layer
 * 
 * This service provides mock data for insurance fraud investigation.
 * In production, replace the simulated Promise returns with fetch/axios calls
 * to your backend API endpoints.
 */

// Simulated in-memory database of claims
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
    status: "Review", // "Review" | "Pending" | "Escalated" | "Legitimate"
    fraud_probability: 87,
    risk_level: "HIGH", // "HIGH" | "MEDIUM" | "LOW"
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
        notes: "Matched repeat scratch marks."
      }
    ],
    decision: null
  },
  {
    claim_id: "CLM003",
    policy_id: "POL-45129",
    customer_name: "Anita Sharma",
    vehicle_number: "TN03 EF 9012",
    vehicle_make: "Tata",
    vehicle_model: "Nexon",
    vehicle_year: 2024,
    accident_date: "2026-08-12",
    submission_date: "2026-08-15",
    status: "Pending",
    fraud_probability: 56,
    risk_level: "MEDIUM",
    recommendation: "Request Additional Evidence",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Moderate paint transfer inconsistency.",
      "Low light quality in uploaded damage photo requires second angle submission."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      damage_description: "Rear bumper scuff and minor tailgate dent.",
      confidence_score: 76.0
    },
    similar_claims: [],
    decision: null
  },
  {
    claim_id: "CLM004",
    policy_id: "POL-33901",
    customer_name: "Robert Evans",
    vehicle_number: "TN04 GH 3456",
    vehicle_make: "Toyota",
    vehicle_model: "Innova Crysta",
    vehicle_year: 2021,
    accident_date: "2026-08-10",
    submission_date: "2026-08-13",
    status: "Legitimate",
    fraud_probability: 18,
    risk_level: "LOW",
    recommendation: "Approve Claim",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Damage pattern fully consistent with reported single-vehicle guardrail scrape.",
      "No historical vehicle or claim overlap found."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
      damage_description: "Left side door scrape matching standard highway barrier height.",
      confidence_score: 96.8
    },
    similar_claims: [],
    decision: {
      decision: "Mark Legitimate",
      notes: "Damage verified against road sensor logs and police report. Approved for payout processing.",
      investigator_id: "INV-8402",
      timestamp: "2026-08-14T11:30:00Z"
    }
  },
  {
    claim_id: "CLM005",
    policy_id: "POL-11894",
    customer_name: "Vikram Malhotra",
    vehicle_number: "TN05 IJ 7890",
    vehicle_make: "Mahindra",
    vehicle_model: "XUV700",
    vehicle_year: 2023,
    accident_date: "2026-08-08",
    submission_date: "2026-08-11",
    status: "Escalated",
    fraud_probability: 92,
    risk_level: "HIGH",
    recommendation: "Escalate to Fraud Investigation Unit",
    ai_model: "DamageVision-ResNet50 v2.4",
    flag_reasons: [
      "Digital image manipulation detected on windshield crack pattern.",
      "Metadata reveals original photo was taken 8 months prior to policy inception."
    ],
    evidence: {
      original_image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
      damage_description: "Windshield shattering and front pillar deformation.",
      confidence_score: 97.4
    },
    similar_claims: [],
    decision: {
      decision: "Escalate Investigation",
      notes: "EXIF metadata confirmed image timestamp mismatch. Sent to forensic investigation team.",
      investigator_id: "INV-8402",
      timestamp: "2026-08-12T15:45:00Z"
    }
  }
];

/**
 * Fetch all claims
 * @returns {Promise<Array>} List of all claim summaries
 */
export async function getClaims() {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockClaims]);
    }, 150);
  });
}

/**
 * Fetch a single claim by its ID
 * @param {string} claimId - The unique claim ID (e.g., "CLM001")
 * @returns {Promise<Object|null>} The full claim object, or null if not found
 */
export async function getClaimById(claimId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const claim = mockClaims.find((c) => c.claim_id.toLowerCase() === (claimId || "").toLowerCase());
      resolve(claim ? JSON.parse(JSON.stringify(claim)) : null);
    }, 150);
  });
}

/**
 * Fetch similar historical claims for a given claim ID
 * @param {string} claimId - The unique claim ID
 * @returns {Promise<Array>} Array of similar claims
 */
export async function getSimilarClaims(claimId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const claim = mockClaims.find((c) => c.claim_id.toLowerCase() === (claimId || "").toLowerCase());
      resolve(claim ? [...(claim.similar_claims || [])] : []);
    }, 150);
  });
}

/**
 * Submit a new claim for AI fraud analysis
 * @param {Object} claimData - Form data containing claim, vehicle, and damage details
 * @returns {Promise<Object>} The created claim with AI fraud assessment results
 */
export async function submitClaim(claimData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a new sequential Claim ID if not provided
      const newIdNumber = mockClaims.length + 1;
      const claim_id = claimData.claim_id || `CLM${String(newIdNumber).padStart(3, "0")}`;
      
      // Simulate AI fraud scoring
      const randomScore = Math.floor(Math.random() * 40) + 55; // 55% - 95%
      const risk_level = randomScore > 75 ? "HIGH" : randomScore > 40 ? "MEDIUM" : "LOW";
      const recommendation =
        risk_level === "HIGH"
          ? "Manual Investigation"
          : risk_level === "MEDIUM"
          ? "Request Additional Evidence"
          : "Approve Claim";

      const newClaim = {
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

      // Add to mock collection at the top
      mockClaims.unshift(newClaim);
      resolve(JSON.parse(JSON.stringify(newClaim)));
    }, 300);
  });
}

/**
 * Save an investigator's final decision for a claim
 * @param {string} claimId - The ID of the claim being decided
 * @param {Object} decisionData - Object containing { decision, notes, investigator_id }
 * @returns {Promise<Object>} Updated claim object
 */
export async function saveDecision(claimId, decisionData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const claimIndex = mockClaims.findIndex((c) => c.claim_id.toLowerCase() === (claimId || "").toLowerCase());
      if (claimIndex === -1) {
        reject(new Error(`Claim with ID ${claimId} not found.`));
        return;
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

      resolve(JSON.parse(JSON.stringify(mockClaims[claimIndex])));
    }, 200);
  });
}

export default {
  getClaims,
  getClaimById,
  getSimilarClaims,
  submitClaim,
  saveDecision
};
