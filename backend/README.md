# ClaimShield AI — FastAPI Backend

AI-Powered Vehicle Insurance Claim Fraud Investigation Platform Backend.

---

## 🚀 Quickstart Guide

### 1. Activate Environment & Install Dependencies

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Start MongoDB (Optional)
If MongoDB is installed locally:
```powershell
mongod --dbpath data/db
```
*(Note: If MongoDB is offline, the backend automatically operates in high-speed resilient in-memory mode for development and testing).*

### 3. Run FastAPI Development Server

```powershell
uvicorn app.main:app --reload --port 8000
```

* **Interactive OpenAPI / Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 🧪 Running Automated Tests

```powershell
.\venv\Scripts\python.exe -m pytest tests/ -v
```

---

## 📂 Architecture & Directory Layout

```text
backend/
├── app/
│   ├── main.py                     # FastAPI app, CORS, static uploads, lifecycle
│   ├── core/
│   │   ├── config.py               # Pydantic v2 Settings (.env loader)
│   │   ├── database.py             # Async Motor MongoDB Manager
│   │   └── indexes.py              # Unique & full-text MongoDB indexes
│   ├── models/                     # Pydantic domain models & schemas
│   │   ├── enums.py                # RiskLevel, ClaimStatus, DecisionType
│   │   ├── claim.py                # ClaimCreate, ClaimResponse, ClaimListResponse
│   │   ├── evidence.py             # EvidencePayload, EvidenceUploadResponse
│   │   ├── similarity.py           # SimilarClaimItem, SimilarClaimsListResponse
│   │   ├── decision.py             # DecisionCreate, DecisionResponse, AuditLogEntry
│   │   └── analytics.py            # KPISummary, RiskTrends, RiskDistribution
│   ├── repositories/               # Persistent database query layer
│   │   ├── claim_repo.py           # Claims CRUD, search & pagination
│   │   ├── audit_repo.py           # Immutable audit logging
│   │   └── analytics_repo.py       # MongoDB aggregation pipelines
│   ├── services/                   # Business logic layer
│   │   ├── claim_service.py        # Intake, scoring & adjudication orchestration
│   │   ├── ai_service.py           # BaseAIService & DamageVision inference engine
│   │   ├── similarity_service.py   # 128-dim Cosine & Hybrid similarity engine
│   │   ├── storage_service.py      # Pillow binary inspection & static file storage
│   │   └── analytics_service.py    # Composite dashboard summary aggregator
│   ├── routers/                    # API Route endpoints
│   │   ├── health.py               # /api/v1/health
│   │   ├── evidence.py             # /api/v1/evidence (Uploads)
│   │   ├── ai.py                   # /api/v1/ai (Inference preview & model info)
│   │   ├── similarity.py           # /api/v1/claims/{id}/similar
│   │   ├── claims.py               # /api/v1/claims (Intake, Triage & Decisions)
│   │   └── analytics.py            # /api/v1/analytics (KPIs, Distributions, Trends)
│   └── utils/
│       └── seed_data.py            # Canonical dataset seeder
├── uploads/                        # Static evidence images & heatmaps
└── tests/                          # Automated Pytest suite
```
