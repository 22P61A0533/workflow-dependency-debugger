import { useState } from "react";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import ImpactAnalyzer from "./pages/ImpactAnalyzer";
import AutomationExplorer from "./pages/AutomationExplorer";
import DependencyHealth from "./pages/DependencyHealth";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "impact":
        return <ImpactAnalyzer />;

      case "automations":
        return <AutomationExplorer />;

      case "health":
        return <DependencyHealth />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="app">

      {/* TOP HEADER */}
      <header className="topbar">

        <div>
          <div className="brand">
            Workflow Dependency Debugger
          </div>

          <div className="subtitle">
            Understand what breaks when automation dependencies change.
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          CognoDB Connected
        </div>

      </header>

      {/* NAVIGATION */}
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* CURRENT PAGE */}
      <main className="container">
        {renderPage()}
      </main>

      {/* FOOTER */}
      <footer>
        <span>
          Workflow Dependency Debugger
        </span>

        <span>
          Powered by CognoDB + Neo4j Driver
        </span>
      </footer>

    </div>
  );
}

export default App;