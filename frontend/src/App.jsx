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
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  const handleViewClaim = (claimId) => {
    setSelectedClaimId(claimId);
    setCurrentPage("investigation");
  };

  const handleNavigate = (page, claimId = null) => {
    if (claimId) {
      setSelectedClaimId(claimId);
    }

    setCurrentPage(page);
  };

  return (
    <div>
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <Navbar />

      {currentPage === "dashboard" && (
        <Dashboard />
      )}

      {currentPage === "claims" && (
        <ClaimsQueue
          onViewClaim={handleViewClaim}
        />
      )}

      {currentPage === "new-claim" && (
        <NewClaimPage />
      )}

      {currentPage === "investigation" && (
        <Investigation
          claimId={selectedClaimId}
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
        />
      )}

      {currentPage === "analytics" && (
        <Analytics />
      )}

      {currentPage === "models" && (
        <Models />
      )}

      {currentPage === "settings" && (
        <Settings />
      )}
    </div>
  );
}

export default App;