from typing import List, Dict, Any
from pydantic import BaseModel
from app.repositories.analytics_repo import analytics_repository
from app.models.analytics import (
    KPISummary,
    RiskDistributionItem,
    RiskTrendPoint,
    FraudReasonFrequency,
    ModelAlignmentMetrics,
)


class DashboardSummaryResponse(BaseModel):
    kpis: KPISummary
    risk_distribution: List[RiskDistributionItem]
    risk_trends: List[RiskTrendPoint]
    top_fraud_reasons: List[FraudReasonFrequency]
    model_alignment: ModelAlignmentMetrics


class AnalyticsService:
    async def get_dashboard_summary(self) -> DashboardSummaryResponse:
        """
        Aggregates all key dashboard metrics into a single optimized response payload.
        """
        kpis = await analytics_repository.get_kpis()
        risk_dist = await analytics_repository.get_risk_distribution()
        risk_trends = await analytics_repository.get_risk_trends(days=7)
        fraud_reasons = await analytics_repository.get_fraud_reason_frequencies()
        alignment = await analytics_repository.get_model_alignment()

        return DashboardSummaryResponse(
            kpis=kpis,
            risk_distribution=risk_dist,
            risk_trends=risk_trends,
            top_fraud_reasons=fraud_reasons,
            model_alignment=alignment
        )

    async def get_kpis(self) -> KPISummary:
        return await analytics_repository.get_kpis()

    async def get_risk_distribution(self) -> List[RiskDistributionItem]:
        return await analytics_repository.get_risk_distribution()

    async def get_risk_trends(self, days: int = 7) -> List[RiskTrendPoint]:
        return await analytics_repository.get_risk_trends(days=days)

    async def get_fraud_reasons(self) -> List[FraudReasonFrequency]:
        return await analytics_repository.get_fraud_reason_frequencies()

    async def get_model_alignment(self) -> ModelAlignmentMetrics:
        return await analytics_repository.get_model_alignment()


analytics_service = AnalyticsService()
