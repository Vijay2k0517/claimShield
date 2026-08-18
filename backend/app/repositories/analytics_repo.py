from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from collections import Counter
import logging

from app.core.database import db_manager
from app.repositories.claim_repo import claim_repository
from app.repositories.audit_repo import audit_repository
from app.models.analytics import (
    KPISummary,
    RiskDistributionItem,
    RiskTrendPoint,
    FraudReasonFrequency,
    ModelAlignmentMetrics,
)
from app.models.enums import RiskLevel, ClaimStatus

logger = logging.getLogger("claimshield.analytics_repo")


class AnalyticsRepository:
    @property
    def claims_collection(self):
        return db_manager.get_collection("claims")

    @property
    def audit_collection(self):
        return db_manager.get_collection("audit_logs")

    async def get_kpis(self) -> KPISummary:
        """Calculates high-level dashboard metric KPIs."""
        col = self.claims_collection
        if col is not None:
            try:
                pipeline = [
                    {
                        "$group": {
                            "_id": None,
                            "total_claims": {"$sum": 1},
                            "pending_reviews": {
                                "$sum": {"$cond": [{"$eq": ["$status", "Review"]}, 1, 0]}
                            },
                            "high_risk_claims": {
                                "$sum": {"$cond": [{"$eq": ["$risk_level", "HIGH"]}, 1, 0]}
                            },
                            "escalated_claims": {
                                "$sum": {"$cond": [{"$eq": ["$status", "Escalated"]}, 1, 0]}
                            },
                            "legitimate_claims": {
                                "$sum": {"$cond": [{"$eq": ["$status", "Legitimate"]}, 1, 0]}
                            },
                            "avg_fraud_probability": {"$avg": "$fraud_probability"}
                        }
                    }
                ]
                res = await col.aggregate(pipeline).to_list(length=1)
                if res:
                    data = res[0]
                    return KPISummary(
                        total_claims=data.get("total_claims", 0),
                        pending_reviews=data.get("pending_reviews", 0),
                        high_risk_claims=data.get("high_risk_claims", 0),
                        escalated_claims=data.get("escalated_claims", 0),
                        legitimate_claims=data.get("legitimate_claims", 0),
                        avg_fraud_probability=round(data.get("avg_fraud_probability", 0.0) or 0.0, 1)
                    )
            except Exception as e:
                logger.warning(f"MongoDB KPI aggregation failed, falling back: {e}")

        # In-memory calculation fallback
        claims = list(claim_repository._memory_store.values())
        total = len(claims)
        if total == 0:
            return KPISummary()

        pending = sum(1 for c in claims if c.get("status") == ClaimStatus.REVIEW.value)
        high = sum(1 for c in claims if c.get("risk_level") == RiskLevel.HIGH.value)
        escalated = sum(1 for c in claims if c.get("status") == ClaimStatus.ESCALATED.value)
        legitimate = sum(1 for c in claims if c.get("status") == ClaimStatus.LEGITIMATE.value)
        avg_prob = sum(float(c.get("fraud_probability", 0)) for c in claims) / total

        return KPISummary(
            total_claims=total,
            pending_reviews=pending,
            high_risk_claims=high,
            escalated_claims=escalated,
            legitimate_claims=legitimate,
            avg_fraud_probability=round(avg_prob, 1)
        )

    async def get_risk_distribution(self) -> List[RiskDistributionItem]:
        """Calculates count and percentage breakdown for each risk tier."""
        kpi = await self.get_kpis()
        total = kpi.total_claims or 1

        col = self.claims_collection
        if col is not None:
            try:
                pipeline = [
                    {"$group": {"_id": "$risk_level", "count": {"$sum": 1}}}
                ]
                res = await col.aggregate(pipeline).to_list(length=10)
                if res:
                    counts = {r["_id"]: r["count"] for r in res}
                    items = []
                    for tier in ["LOW", "REVIEW", "HIGH"]:
                        c = counts.get(tier, 0)
                        items.append(RiskDistributionItem(
                            risk_level=tier,
                            count=c,
                            percentage=round((c / total) * 100, 1)
                        ))
                    return items
            except Exception as e:
                logger.warning(f"MongoDB risk distribution aggregation failed: {e}")

        claims = list(claim_repository._memory_store.values())
        counts = Counter(c.get("risk_level", "REVIEW") for c in claims)
        items = []
        for tier in ["LOW", "REVIEW", "HIGH"]:
            c = counts.get(tier, 0)
            items.append(RiskDistributionItem(
                risk_level=tier,
                count=c,
                percentage=round((c / total) * 100, 1)
            ))
        return items

    async def get_risk_trends(self, days: int = 7) -> List[RiskTrendPoint]:
        """Generates time-series risk trends across the last N days."""
        today = datetime.now(timezone.utc).date()
        date_map: Dict[str, Dict[str, int]] = {}
        for i in range(days - 1, -1, -1):
            d_str = (today - timedelta(days=i)).isoformat()
            date_map[d_str] = {"LOW": 0, "REVIEW": 0, "HIGH": 0, "total": 0}

        claims = list(claim_repository._memory_store.values())
        col = self.claims_collection
        if col is not None:
            try:
                claims = await col.find({}, {"_id": 0, "submission_date": 1, "risk_level": 1}).to_list(length=1000)
            except Exception:
                pass

        for c in claims:
            s_date = c.get("submission_date", "")
            risk = c.get("risk_level", "REVIEW")
            if s_date in date_map:
                if risk in date_map[s_date]:
                    date_map[s_date][risk] += 1
                date_map[s_date]["total"] += 1

        points = []
        for d_str, counts in date_map.items():
            points.append(RiskTrendPoint(
                date=d_str,
                low=counts["LOW"],
                review=counts["REVIEW"],
                high=counts["HIGH"],
                total=counts["total"]
            ))
        return points

    async def get_fraud_reason_frequencies(self) -> List[FraudReasonFrequency]:
        """Calculates occurrence counts and frequencies for anomaly reasons."""
        claims = list(claim_repository._memory_store.values())
        col = self.claims_collection
        if col is not None:
            try:
                claims = await col.find({}, {"_id": 0, "flag_reasons": 1}).to_list(length=1000)
            except Exception:
                pass

        all_reasons: List[str] = []
        for c in claims:
            all_reasons.extend(c.get("flag_reasons", []))

        total_flags = len(all_reasons) or 1
        counter = Counter(all_reasons)

        results = []
        for reason, count in counter.most_common(10):
            results.append(FraudReasonFrequency(
                reason=reason,
                count=count,
                percentage=round((count / total_flags) * 100, 1)
            ))
        return results

    async def get_model_alignment(self) -> ModelAlignmentMetrics:
        """Evaluates alignment between initial AI prediction and final human decision."""
        logs = await audit_repository.get_audit_history(limit=500)
        total_adjudicated = len(logs)
        if total_adjudicated == 0:
            return ModelAlignmentMetrics()

        agreed = 0
        disagreed = 0
        fp_mitigated = 0

        for entry in logs:
            ai_risk = entry.get("ai_risk_level", "")
            decision = entry.get("investigator_decision", "")

            # High risk claim marked legitimate by human -> False Positive Mitigated!
            if ai_risk == "HIGH" and decision == "Mark Legitimate":
                disagreed += 1
                fp_mitigated += 1
            elif ai_risk == "HIGH" and decision == "Escalate Investigation":
                agreed += 1
            elif ai_risk == "LOW" and decision == "Mark Legitimate":
                agreed += 1
            else:
                agreed += 1

        agreement_rate = round((agreed / total_adjudicated) * 100, 1)

        return ModelAlignmentMetrics(
            total_adjudicated=total_adjudicated,
            ai_human_agreed=agreed,
            ai_human_disagreed=disagreed,
            agreement_rate=agreement_rate,
            false_positives_mitigated=fp_mitigated
        )


analytics_repository = AnalyticsRepository()
