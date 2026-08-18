from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    REVIEW = "REVIEW"
    HIGH = "HIGH"
    # MEDIUM supported for backwards-compatibility / UI mapping
    MEDIUM = "MEDIUM"


class ClaimStatus(str, Enum):
    REVIEW = "Review"
    PENDING = "Pending"
    ESCALATED = "Escalated"
    LEGITIMATE = "Legitimate"


class DecisionType(str, Enum):
    MARK_LEGITIMATE = "Mark Legitimate"
    REQUEST_ADDITIONAL_EVIDENCE = "Request Additional Evidence"
    ESCALATE_INVESTIGATION = "Escalate Investigation"


class RecommendationType(str, Enum):
    APPROVE_CLAIM = "Approve Claim"
    MANUAL_INVESTIGATION = "Manual Investigation"
    REQUEST_ADDITIONAL_EVIDENCE = "Request Additional Evidence"
    ESCALATE_INVESTIGATION = "Escalate Investigation"
