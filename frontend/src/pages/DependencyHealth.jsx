import { useEffect, useState } from "react";
import axios from "axios";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const API_URL = "http://127.0.0.1:8000";

function DependencyHealth() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCycles();
  }, []);

  async function loadCycles() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/dependencies/cycles`
      );

      setCycles(response.data.cycles || []);
    } catch (err) {
      console.error("Cycles API error:", err);

      setError(
        "Unable to check automation dependencies."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        message="Checking automation dependencies..."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Dependency health unavailable"
        message={error}
        onRetry={loadCycles}
      />
    );
  }

  return (
    <div className="dependency-health">

      <section className="cycle-card">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              DEPENDENCY HEALTH
            </p>

            <h2>
              Circular dependencies
            </h2>

          </div>

          <div
            className={
              cycles.length === 0
                ? "health-badge healthy"
                : "health-badge danger"
            }
          >

            {cycles.length === 0
              ? "Healthy"
              : `${cycles.length} cycle${
                  cycles.length === 1
                    ? ""
                    : "s"
                } detected`}

          </div>

        </div>

        {cycles.length === 0 ? (

          <div className="healthy-state">

            <div className="check-icon">
              ✓
            </div>

            <div>

              <strong>
                No circular dependencies detected
              </strong>

              <p>
                Your automation dependency graph
                currently contains no detected loops.
              </p>

            </div>

          </div>

        ) : (

          <div className="cycle-list">

            {cycles.map((cycle, index) => (

              <div
                className="cycle-item"
                key={index}
              >

                <strong>
                  Cycle {index + 1}
                </strong>

                <div>

                  {cycle.cycle?.map(
                    (node, nodeIndex) => (

                      <span key={node.id}>

                        {node.name}

                        {nodeIndex <
                        cycle.cycle.length - 1
                          ? " → "
                          : ""}

                      </span>

                    )
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default DependencyHealth;