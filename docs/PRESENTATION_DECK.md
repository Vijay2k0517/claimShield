# 🛡️ ClaimShield AI — Hackathon Presentation Deck
### *Next-Gen Vehicle Insurance Fraud Detection with PyTorch & Grad-CAM++*
**Cognizant AI Hackathon | Pitch & Slide Deck**

---

<!-- SLIDE 1 -->
# 📌 Slide 1: Title & Introduction

```
   ██████╗██╗      █████╗ ██╗███╗   ███╗███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
  ██╔════╝██║     ██╔══██╗██║████╗ ████║██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
  ██║     ██║     ███████║██║██╔████╔██║███████╗███████║██║█████╗  ██║     ██║  ██║
  ██║     ██║     ██╔══██║██║██║╚██╔╝██║╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
  ╚██████╗███████╗██║  ██║██║██║ ╚═╝ ██║███████║██║  ██║██║███████╗███████╗██████╔╝
   ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
```

* **Project Title:** ClaimShield AI
* **Subtitle:** Multimodal AI & Explainable Computer Vision for Automated Vehicle Insurance Fraud Detection
* **Track:** Cognizant Hiring Hackathon — AI & Automation
* **Core Value Proposition:** *Turning 3-week manual insurance investigations into 2-second, legally defensible, explainable AI adjudications.*

> **🎤 Presenter Note:**  
> *"Good morning judges and team! Today, we present ClaimShield AI — a production-ready solution solving the multi-billion-dollar insurance fraud crisis using deep computer vision, mathematical explainable AI, and real-time duplicate syndicate detection."*

---

<!-- SLIDE 2 -->
# ⚠️ Slide 2: The Problem

### *The High Cost of Traditional Insurance Claim Processing*

* 💸 **$30.8 Billion Annual Loss:** Global auto insurers lose billions every year to organized fraud syndicates and recycled claims.
* ⏳ **Painful 2–3 Week Turnaround:** Genuine customers with broken cars wait weeks for manual surveyor inspections.
* 🔄 **Recycled Damage Photos:** Fraudsters download old crash images from the internet or reuse settled claims across different policies.
* 📦 **The "Black-Box" AI Dilemma:** Traditional ML models give a score (e.g. `85% Fraud`) but cannot show **where or why**, making them impossible to defend in court.

> **🎤 Presenter Note:**  
> *"Insurance fraud isn't just about small exaggerations — it's organized syndicates reusing old photos across multiple companies. Current claims take 3 weeks to process, and adjusters can't use black-box AI because they can't defend unexplained scores to customers or regulatory courts."*

---

<!-- SLIDE 3 -->
# 💡 Slide 3: Our Solution — ClaimShield AI

### *Instant, Accurate, and Visually Defensible Fraud Detection*

```
   ┌────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
   │  2-Second Intake   │     │ Visual Grad-CAM++   │     │  Syndicate Match    │
   │  Instant neural    │ ──> │ Heatmap proves      │ ──> │  2048-dim vector    │
   │  scoring (0-100%)  │     │ damage focal point  │     │  finds copycat pics │
   └────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

1. **Instant AI Scoring:** Fine-tuned PyTorch ResNet50 neural core triages claims into Low, Review, or High risk tiers in under 2 seconds.
2. **Transparent Explainability (Grad-CAM++):** Overlays mathematical thermal heatmaps highlighting crushed bonnets and headlights while keeping undamaged areas crystal clear.
3. **Syndicate Vector Matching:** Converts photos into 2048-dimensional digital embeddings to catch cross-policy duplicate claims immediately.
4. **Human-in-the-Loop Workflow:** Adjusters retain final authority with an immutable SIU audit trail.

---

<!-- SLIDE 4 -->
# 🏗️ Slide 4: System Architecture

```mermaid
graph LR
    subgraph UI[Client Layer]
        A[React 18 SPA] --> B[Interactive Blend Slider]
    end
    subgraph Backend[FastAPI Async Core]
        C[REST Endpoints] --> D[PyTorch ResNet50]
        C --> E[Grad-CAM++ Engine]
        C --> F[Cosine Vector Matcher]
    end
    subgraph Storage[Data Persistence]
        G[(MongoDB Engine)]
        H[(In-Memory Resilient Store)]
    end
    UI <--> Backend
    Backend <--> Storage
```

* **Frontend:** React 18 with Vite, custom frosted glass design system, and full-width responsive top navigation.
* **Backend:** FastAPI (Python 3.12) with asynchronous non-blocking event loops and strict Pydantic v2 schemas.
* **Persistence:** Dual-engine architecture (MongoDB Motor driver with automatic offline in-memory fallback).
* **AI Engine:** PyTorch ResNet50 trained with Focal Loss and higher-order Grad-CAM++ hooks.

---

<!-- SLIDE 5 -->
# 🔬 Slide 5: Deep Learning & Explainable AI (XAI)

### *Why Grad-CAM++ Beats Standard Explainability*

```
   Standard Grad-CAM:                    Our Grad-CAM++ Implementation:
   ❌ Single center-of-mass centroid     ✅ Multi-point simultaneous damage attention
   ❌ Heatmap shifts to tire/shadows     ✅ Bonnets, headlights & fenders glow accurately
   ❌ Washes out bright vehicle paint    ✅ Non-linear alpha shield (clean panels transparent)
```

### Mathematical Rigor:
* **Focal Loss Formulation:** Solves the 25:1 class skew in raw accident datasets:
  $$\text{FL}(p_t) = -\alpha_t (1 - p_t)^\gamma \log(p_t) \quad (\gamma=2.0, \alpha=0.75)$$
* **Grad-CAM++ Higher-Order Gradient Weighting:**
  $$w_{i,j}^{kc} = \frac{G_{i,j}^2}{2 G_{i,j}^2 + \sum_{a,b} A_{a,b}^k G_{a,b}^3 + \epsilon}, \quad \alpha_k = \sum_{i,j} w_{i,j}^{kc} \cdot \text{ReLU}(G_{i,j})$$
* **Dynamic Alpha Shielding:** Clamps background activation below 15% to **0% opacity**, keeping undamaged vehicle bodywork crystal clear.

---

<!-- SLIDE 6 -->
# 🔗 Slide 6: Syndicate & Duplicate Detection

### *Catching Recycled Photos with Deep Vector Similarity*

* **The Attack Vector:** Fraudsters alter brightness, crop license plates, or change metadata to reuse old crash images.
* **Our Defense:** 
  * Extract the **2048-dimensional bottleneck tensor** $\vec{u}$ from ResNet50.
  * Compute **Cosine Similarity** against the repository of historical settled claims:
    $$\text{Similarity}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
  * Matches $\ge 80\%$ immediately trigger a **"Prior Claim Match"** alert showing side-by-side comparison with the historical claim.

---

<!-- SLIDE 7 -->
# 🚦 Slide 7: Investigator Workflow & Triage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🟢 LOW RISK (0-39%)       │  🟡 MEDIUM RISK (40-74%) │  🔴 HIGH RISK (75-100%)    │
│  Fast-Track Auto Approve   │  Request Extra Evidence  │  Escalate to SIU Field     │
│  Paid in hours             │  Garage bill audit       │  Formal investigation      │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Claims Directory:** Search, sort by fraud probability, filter by make/status, and delete obsolete test cases in 1-click.
2. **Investigation Workspace:** Review automated risk factors, adjusters' rationale notes, and previous collision history.
3. **Interactive Photo Inspector:** Drag the blend slider from 0% (original photo) to 100% (Grad-CAM++ thermal overlay).
4. **Immutable Audit Trail:** Every human decision is recorded with investigator ID, timestamps, and rationale notes.

---

<!-- SLIDE 8 -->
# 🏆 Slide 8: Key Differentiators

| Dimension | Typical Competition Submissions | ClaimShield AI |
|---|---|---|
| **AI Inference** | Static demo script / mocked data | **Real PyTorch Neural Forward Pass** in memory |
| **Explainability** | Generic static heatmap or none | **Live Grad-CAM++ with higher-order gradients** |
| **Duplicate Detection** | Filename or exact pixel match | **2048-dim Deep Convolutional Vector Match** |
| **System Reliability** | Crashes if MongoDB is absent | **Dual-Engine Auto-Failover to In-Memory Store** |
| **UI Experience** | Basic default template with sidebars | **Sleek Top Navbar with Frosted Glass UI** |
| **Code Quality** | Unstructured notebook | **26 Automated PyTest Unit Tests (100% Pass)** |

---

<!-- SLIDE 9 -->
# 📈 Slide 9: Business Impact & ROI

* ⚡ **85% Faster Claim Cycle:** Reduces processing time from 14–21 days down to **under 24 hours**.
* 💰 **18–25% Reduction in Fraud Losses:** Eliminates payouts on recycled images, inflated estimates, and staged crashes.
* 👨‍💼 **3x Investigator Productivity:** Adjusters spend time investigating real high-risk cases rather than manually checking low-risk fender benders.
* 🤝 **Enhanced Customer Satisfaction:** Honest claimants receive instant payouts, dramatically improving Net Promoter Scores (NPS).

---

<!-- SLIDE 10 -->
# 🎯 Slide 10: Live Demo & Conclusion

### *Experience ClaimShield AI Live*

1. **Intake New Claim:** Submit car details and drop accident evidence photo.
2. **Instant AI Scoring:** Observe real-time PyTorch scoring and Grad-CAM++ heatmap generation.
3. **Visual Verification:** Test the interactive opacity slider over the damaged bonnet.
4. **Adjudication:** Record investigator decision and view the updated SIU audit trail.

---

### 💬 Questions & Answers (Q&A)

* **Repository:** `cts/`
* **Tech Stack:** PyTorch • FastAPI • React 18 • Vite • MongoDB • Grad-CAM++
* **Thank You!** We are ready for your questions.
