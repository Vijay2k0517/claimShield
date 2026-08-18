from typing import List
from fastapi import APIRouter, Query
from app.models.analytics import (
    KPISummary,
    RiskDistributionItem,
    RiskTrendPoint,
    FraudReasonFrequency,
    ModelAlignmentMetrics,
)
from app.services.analytics_service import (
    analytics_service,
    DashboardSummaryResponse,
)

router = APIRouter(prefix="/analytics", tags=["Dashboard & Risk Analytics"])


@router.get(
    "/dashboard-summary",
    response_model=DashboardSummaryResponse,
    summary="Unified Dashboard Overview Payload"
)
async def get_dashboard_summary():
    """
    Returns the complete aggregated state for the enterprise dashboard in a single call,
    including KPIs, risk distributions, 7-day trendlines, top fraud signals, and AI alignment.
    """
    return await analytics_service.get_dashboard_summary()


@router.get(
    "/kpis",
    response_model=KPISummary,
    summary="Get High-Level Metric Strip KPIs"
)
async def get_kpis():
    """
    Returns high-level operational metrics: total claims, pending reviews,
    high-risk flags, escalated cases, legitimate cases, and average fraud score.
    """
    return await analytics_service.get_kpis()


@router.get(
    "/risk-distribution",
    response_model=List[RiskDistributionItem],
    summary="Get Claims Distribution across Risk Levels"
)
async def get_risk_distribution():
    """
    Returns the count and percentage breakdown of claims across LOW, REVIEW, and HIGH tiers.
    """
    return await analytics_service.get_risk_distribution()


@router.get(
    "/risk-trends",
    response_model=List[RiskTrendPoint],
    summary="Get Daily Time-Series Risk Volume Trends"
)
async def get_risk_trends(
    days: int = Query(7, ge=1, le=90, description="Number of days to analyze")
):
    """
    Returns daily time-series counts of claims categorized by risk level.
    """
    return await analytics_service.get_risk_trends(days=days)


@router.get(
    "/fraud-types",
    response_model=List[FraudReasonFrequency],
    summary="Get Anomaly Reason Frequencies"
)
async def get_fraud_types():
    """
    Returns the top recurring anomaly flag reasons identified by the AI system.
    """
    return await analytics_service.get_fraud_reasons()


@router.get(
    "/model-alignment",
    response_model=ModelAlignmentMetrics,
    summary="Get Human vs AI Adjudication Metrics"
)
async def get_model_alignment():
    """
    Measures agreement rate between AI predictions and final investigator outcomes,
    including false positive mitigation counters.
    """
    return await analytics_service.get_model_alignment()
