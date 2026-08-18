import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import ClaimsQueue from "./pages/ClaimsQueue";
import SimilarClaimsPage from "./pages/SimilarClaimsPage";
import Investigation from "./pages/Investigation";
import Evidence from "./pages/Evidence";
import Decision from "./pages/Decision";
import Analytics from "./pages/Analytics";
import NewClaimPage from "./pages/NewClaimPage";
import Models from "./pages/Models";
import Settings from "./pages/Settings";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedClaimId, setSelectedClaimId] = useState("CLM001");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleViewClaim = (claimId) => {
    setSelectedClaimId(claimId);
    setCurrentPage("investigation");
  };

  const handleNavigate = (page, claimId = null) => {
    if (claimId) {
      setSelectedClaimId(claimId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-container">
      {/* Toast Notification Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            background: toast.type === "success" ? "linear-gradient(135deg, #065f46 0%, #047857 100%)" : "linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.88rem",
            fontWeight: "600",
            animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        selectedClaimId={selectedClaimId}
        onNavigate={handleNavigate}
      />

      {/* Top Header Hub */}
      <Navbar
        currentPage={currentPage}
        selectedClaimId={selectedClaimId}
        onNavigate={handleNavigate}
      />

      {/* Main Routed Content View */}
      {currentPage === "dashboard" && (
        <Dashboard
          onNavigate={handleNavigate}
          onViewClaim={handleViewClaim}
        />
      )}

      {currentPage === "claims" && (
        <ClaimsQueue
          onNavigate={handleNavigate}
          onViewClaim={handleViewClaim}
        />
      )}

      {currentPage === "new-claim" && (
        <NewClaimPage
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}

      {currentPage === "investigation" && (
        <Investigation
          claimId={selectedClaimId}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "evidence" && (
        <Evidence
          claimId={selectedClaimId}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "similar-claims" && (
        <SimilarClaimsPage
          claimId={selectedClaimId}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "decision" && (
        <Decision
          claimId={selectedClaimId}
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}

      {currentPage === "analytics" && (
        <Analytics
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "models" && (
        <Models
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === "settings" && (
        <Settings
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;