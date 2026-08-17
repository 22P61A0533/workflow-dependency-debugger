import { useEffect, useState } from "react";
import axios from "axios";
import AutomationCard from "../components/AutomationCard";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const API_URL = "http://127.0.0.1:8000";

function AutomationExplorer() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAutomations();
  }, []);

  async function loadAutomations() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/automations`
      );

      setAutomations(response.data.automations || []);
    } catch (err) {
      console.error("Automation API error:", err);
      setError("Unable to load automation workflows.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        message="Loading automation workflows..."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadAutomations}
      />
    );
  }

  if (automations.length === 0) {
    return (
      <EmptyState
        title="No automations found"
        message="No automation workflows are available in CognoDB."
      />
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <p className="eyebrow">
            AUTOMATION EXPLORER
          </p>

          <h1>
            Automation Workflows
          </h1>

          <p className="page-description">
            Explore the tools, actions and data fields
            connected across your automation ecosystem.
          </p>
        </div>

        <div className="automation-count">
          <strong>
            {automations.length}
          </strong>

          <span>
            Automations
          </span>
        </div>

      </div>

      <div className="automation-grid">

        {automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
          />
        ))}

      </div>

    </div>
  );
}

export default AutomationExplorer;