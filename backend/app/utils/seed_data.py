import asyncio
import logging
from app.core.database import db_manager
from app.core.indexes import init_indexes
from app.repositories.claim_repo import claim_repository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("claimshield.seed")

CANONICAL_CLAIMS = [
    {
        "claim_id": "CLM001",
        "policy_id": "POL-98231",
        "customer_name": "Sarah Jenkins",
        "vehicle_number": "TN01 AB 1234",
        "vehicle_make": "Hyundai",
        "vehicle_model": "Creta",
        "vehicle_year": 2023,
        "accident_date": "2026-08-15",
        "submission_date": "2026-08-17",
        "status": "Review",
        "fraud_probability": 87.0,
        "risk_level": "HIGH",
        "recommendation": "Manual Investigation",
        "ai_model": "DamageVision-ResNet50 v2.4",
        "flag_reasons": [
            "Vehicle damage pattern does not match reported accident dynamics.",
            "AI detected pre-existing structural wear under modern impact marks.",
            "High visual similarity (91%) to a previously settled total loss claim (CLM045)."
        ],
        "evidence": {
            "original_image": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "heatmap": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "overlay": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "damage_description": "Front bumper compression, radiator support deformation, fractured right headlamp assembly.",
            "confidence_score": 94.2
        },
        "similar_claims": [
            {
                "claim_id": "CLM045",
                "vehicle_number": "TN09 XY 4567",
                "vehicle_make": "Hyundai",
                "vehicle_model": "Creta",
                "accident_date": "2025-11-12",
                "similarity_score": 91.0,
                "risk_level": "HIGH",
                "status": "Escalated",
                "image": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
                "notes": "Identical impact angle and deformation on bumper bracket. Flagged as repeated staged collision."
            },
            {
                "claim_id": "CLM078",
                "vehicle_number": "TN10 PQ 7890",
                "vehicle_make": "Kia",
                "vehicle_model": "Seltos",
                "accident_date": "2026-02-04",
                "similarity_score": 74.0,
                "risk_level": "MEDIUM",
                "status": "Review",
                "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
                "notes": "Partial structural match in headlight mounting brackets."
            }
        ],
        "decision": None
    },
    {
        "claim_id": "CLM002",
        "policy_id": "POL-77412",
        "customer_name": "David Kumar",
        "vehicle_number": "TN02 CD 5678",
        "vehicle_make": "Maruti Suzuki",
        "vehicle_model": "Swift",
        "vehicle_year": 2022,
        "accident_date": "2026-08-14",
        "submission_date": "2026-08-16",
        "status": "Review",
        "fraud_probability": 81.0,
        "risk_level": "HIGH",
        "recommendation": "Manual Investigation",
        "ai_model": "DamageVision-ResNet50 v2.4",
        "flag_reasons": [
            "Multiple point impacts inconsistent with single collision scenario.",
            "Tool marks detected near side fender panel inconsistent with roadway accident."
        ],
        "evidence": {
            "original_image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
            "heatmap": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
            "overlay": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
            "damage_description": "Right quarter panel scrape and door shell depression.",
            "confidence_score": 88.5
        },
        "similar_claims": [
            {
                "claim_id": "CLM032",
                "vehicle_number": "TN02 MM 9988",
                "vehicle_make": "Maruti Suzuki",
                "vehicle_model": "Swift",
                "accident_date": "2025-09-19",
                "similarity_score": 83.0,
                "risk_level": "HIGH",
                "status": "Escalated",
                "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
                "notes": "Similar fender panel stress marks."
            }
        ],
        "decision": None
    },
    {
        "claim_id": "CLM003",
        "policy_id": "POL-55120",
        "customer_name": "Priya Sharma",
        "vehicle_number": "TN05 EF 9012",
        "vehicle_make": "Honda",
        "vehicle_model": "City",
        "vehicle_year": 2024,
        "accident_date": "2026-08-16",
        "submission_date": "2026-08-17",
        "status": "Legitimate",
        "fraud_probability": 14.0,
        "risk_level": "LOW",
        "recommendation": "Approve Claim",
        "ai_model": "DamageVision-ResNet50 v2.4",
        "flag_reasons": [],
        "evidence": {
            "original_image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
            "heatmap": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
            "overlay": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
            "damage_description": "Rear bumper dent and scratch consistent with stationary rear collision.",
            "confidence_score": 96.1
        },
        "similar_claims": [],
        "decision": {
            "decision": "Mark Legitimate",
            "notes": "Clear camera footage and police report match damage points.",
            "investigator_id": "INV-8402",
            "timestamp": "2026-08-17T11:30:00Z"
        }
    },
    {
        "claim_id": "CLM004",
        "policy_id": "POL-33984",
        "customer_name": "Rajesh Patel",
        "vehicle_number": "TN07 GH 3456",
        "vehicle_make": "Tata",
        "vehicle_model": "Nexon",
        "vehicle_year": 2023,
        "accident_date": "2026-08-11",
        "submission_date": "2026-08-13",
        "status": "Review",
        "fraud_probability": 62.0,
        "risk_level": "REVIEW",
        "recommendation": "Request Additional Evidence",
        "ai_model": "DamageVision-ResNet50 v2.4",
        "flag_reasons": [
            "Front bumper scratch angle mismatch with stated stationary pole impact.",
            "Estimated repair quote is 45% above regional benchmark."
        ],
        "evidence": {
            "original_image": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
            "heatmap": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
            "overlay": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
            "damage_description": "Lower valence split, grille lattice crack.",
            "confidence_score": 82.0
        },
        "similar_claims": [],
        "decision": None
    },
    {
        "claim_id": "CLM005",
        "policy_id": "POL-11920",
        "customer_name": "Anita Desai",
        "vehicle_number": "TN09 KL 7890",
        "vehicle_make": "Mahindra",
        "vehicle_model": "XUV700",
        "vehicle_year": 2023,
        "accident_date": "2026-08-08",
        "submission_date": "2026-08-10",
        "status": "Escalated",
        "fraud_probability": 92.0,
        "risk_level": "HIGH",
        "recommendation": "Escalate Investigation",
        "ai_model": "DamageVision-ResNet50 v2.4",
        "flag_reasons": [
            "Damage severity incompatible with low-speed driveway report.",
            "Exif metadata timestamp differs from stated accident timestamp by 14 days."
        ],
        "evidence": {
            "original_image": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "heatmap": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "overlay": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "damage_description": "Left side t-bone impact crushing door pillars and deploying side curtain airbags.",
            "confidence_score": 97.4
        },
        "similar_claims": [],
        "decision": {
            "decision": "Escalate Investigation",
            "notes": "Sent to SIU field investigator due to metadata timestamp discrepancy.",
            "investigator_id": "INV-7104",
            "timestamp": "2026-08-11T14:15:00Z"
        }
    }
]


async def seed_database(force: bool = False):
    """
    Seeds the MongoDB database with rich canonical claims if empty or forced.
    """
    db = db_manager.get_database()
    if db is None:
        logger.warning("Database offline: Cannot seed data.")
        return False

    claims_col = db["claims"]
    count = await claims_col.count_documents({})
    
    if count > 0 and not force:
        logger.info(f"Database already contains {count} claims. Skipping seed.")
        return True

    if force and count > 0:
        logger.info("Force flag provided: Clearing existing claims before seed...")
        await claims_col.delete_many({})

    logger.info(f"Seeding {len(CANONICAL_CLAIMS)} canonical claims into MongoDB...")
    for claim in CANONICAL_CLAIMS:
        # Clone claim dict to prevent mutating the original
        claim_copy = dict(claim)
        await claim_repository.create_claim(claim_copy)

    logger.info("✅ Database seeded successfully with canonical claims.")
    return True


if __name__ == "__main__":
    async def main():
        await db_manager.connect()
        await init_indexes()
        await seed_database(force=True)
        await db_manager.disconnect()

    asyncio.run(main())
