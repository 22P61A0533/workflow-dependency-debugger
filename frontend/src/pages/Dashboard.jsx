import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://workflow-dependency-debugger.onrender.com";

function Dashboard() {
  const [fields, setFields] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [cycles, setCycles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [
        fieldsResponse,
        automationsResponse,
        cyclesResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/api/fields`),
        axios.get(`${API_URL}/api/automations`),
        axios.get(`${API_URL}/api/dependencies/cycles`),
      ]);

      setFields(
        fieldsResponse.data.fields || []
      );

      setAutomations(
        automationsResponse.data.automations || []
      );

      setCycles(
        cyclesResponse.data.cycles || []
      );
    } catch (error) {
      console.error(
        "Dashboard API error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">

      <section className="hero">

        <div>

          <p className="eyebrow">
            WORKFLOW DEPENDENCY DEBUGGER
          </p>

          <h1>
            Understand your automation
            <br />
            ecosystem at a glance.
          </h1>

          <p className="hero-text">
            Explore automation relationships,
            identify dependency risks and
            understand the downstream impact
            of changing shared data fields.
          </p>

        </div>

      </section>

      <section className="stats-grid">

        <div className="stat-card">

          <span className="stat-label">
            AUTOMATIONS
          </span>

          <strong>
            {loading ? "—" : automations.length}
          </strong>

          <span className="stat-description">
            Connected workflows
          </span>

        </div>

        <div className="stat-card">

          <span className="stat-label">
            DATA FIELDS
          </span>

          <strong>
            {loading ? "—" : fields.length}
          </strong>

          <span className="stat-description">
            Shared data fields
          </span>

        </div>

        <div className="stat-card">

          <span className="stat-label">
            DEPENDENCY CYCLES
          </span>

          <strong>
            {loading ? "—" : cycles.length}
          </strong>

          <span className="stat-description">
            Circular dependencies
          </span>

        </div>

      </section>

      <section className="dashboard-info">

        <div className="dashboard-info-card">

          <div className="info-number">
            01
          </div>

          <div>

            <h2>
              Impact Analysis
            </h2>

            <p>
              Select a shared data field and
              discover which automations depend
              on it and what workflows may be
              affected by a change.
            </p>

          </div>

        </div>

        <div className="dashboard-info-card">

          <div className="info-number">
            02
          </div>

          <div>

            <h2>
              Automation Explorer
            </h2>

            <p>
              Explore every automation, its
              actions, connected tools and the
              data fields it reads and writes.
            </p>

          </div>

        </div>

        <div className="dashboard-info-card">

          <div className="info-number">
            03
          </div>

          <div>

            <h2>
              Dependency Health
            </h2>

            <p>
              Detect circular dependencies that
              could cause automation loops or
              unexpected repeated execution.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;