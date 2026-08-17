import { useEffect, useState } from "react";
import axios from "axios";
import GraphView from "../components/GraphView";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const API_URL = "http://127.0.0.1:8000";

function ImpactAnalyzer() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [impact, setImpact] = useState(null);

  const [loadingFields, setLoadingFields] = useState(true);
  const [loadingImpact, setLoadingImpact] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadFields();
  }, []);

  async function loadFields() {
    try {
      setLoadingFields(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/fields`
      );

      const availableFields =
        response.data.fields || [];

      setFields(availableFields);

      if (availableFields.length > 0) {
        const firstField = availableFields[0].id;

        setSelectedField(firstField);

        loadImpact(firstField);
      }
    } catch (err) {
      console.error("Fields API error:", err);

      setError(
        "Unable to load data fields from CognoDB."
      );
    } finally {
      setLoadingFields(false);
    }
  }

  async function loadImpact(fieldId) {
    if (!fieldId) return;

    try {
      setSelectedField(fieldId);
      setLoadingImpact(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/impact/${fieldId}`
      );

      setImpact(response.data);
    } catch (err) {
      console.error("Impact API error:", err);

      setImpact(null);

      setError(
        "Unable to perform impact analysis."
      );
    } finally {
      setLoadingImpact(false);
    }
  }

  const selectedFieldName =
    fields.find(
      (field) => field.id === selectedField
    )?.name || "";

  if (error && fields.length === 0) {
    return (
      <ErrorState
        title="Impact analysis unavailable"
        message={error}
        onRetry={loadFields}
      />
    );
  }

  return (
    <div className="impact-analyzer">

      {/* HERO */}

      <section className="hero">

        <div>

          <p className="eyebrow">
            GRAPH-BASED AUTOMATION ANALYSIS
          </p>

          <h1>
            See the impact of automation
            <br />
            dependencies before they break.
          </h1>

          <p className="hero-text">
            Select a data field to discover which
            automations write to it and which
            downstream workflows may be affected.
          </p>

        </div>

      </section>

      {/* IMPACT ANALYSIS */}

      <section className="analysis-card">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              IMPACT ANALYSIS
            </p>

            <h2>
              Select a data field
            </h2>

          </div>

        </div>

        {/* FIELD SELECTOR */}

        <div className="field-selector">

          <select
            value={selectedField}
            onChange={(event) =>
              loadImpact(event.target.value)
            }
            disabled={loadingFields}
          >

            {loadingFields ? (

              <option>
                Loading fields...
              </option>

            ) : fields.length === 0 ? (

              <option>
                No fields available
              </option>

            ) : (

              fields.map((field) => (

                <option
                  key={field.id}
                  value={field.id}
                >
                  {field.name}
                </option>

              ))

            )}

          </select>

        </div>

        {/* ERROR */}

        {error && fields.length > 0 && (

          <ErrorState
            message={error}
            onRetry={() =>
              loadImpact(selectedField)
            }
          />

        )}

        {/* LOADING */}

        {loadingImpact && (

          <LoadingState
            message="Analyzing dependency graph..."
          />

        )}

        {/* EMPTY */}

        {!loadingImpact &&
          !impact &&
          !error && (

            <EmptyState
              title="Select a field"
              message="Choose a data field to analyze its automation dependencies."
            />

          )}

        {/* IMPACT RESULT */}

        {!loadingImpact && impact && (

          <div className="impact-content">

            {/* SELECTED FIELD */}

            <div className="field-title">

              <div className="field-icon">
                ↳
              </div>

              <div>

                <div className="small-label">
                  SELECTED FIELD
                </div>

                <h3>
                  {selectedFieldName}
                </h3>

              </div>

            </div>

            {/* GRAPH */}

            <GraphView
              impact={impact}
            />

            {/* SOURCE + DOWNSTREAM */}

            <div className="graph-area">

              {/* SOURCES */}

              <div className="graph-column">

                <div className="column-title">
                  Writes to this field
                </div>

                {impact.source_automations?.length > 0 ? (

                  impact.source_automations.map(
                    (automation) => (

                      <div
                        className="automation-node source-node"
                        key={automation.automation_id}
                      >

                        <div className="node-number">
                          01
                        </div>

                        <div>

                          <div className="node-label">
                            SOURCE AUTOMATION
                          </div>

                          <div className="node-name">
                            {automation.automation_name}
                          </div>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <div className="empty-state">
                    No automation writes to this field.
                  </div>

                )}

              </div>

              {/* CONNECTOR */}

              <div className="connector">

                <span>
                  IMPACT
                </span>

                <div className="arrow">
                  →
                </div>

              </div>

              {/* DOWNSTREAM */}

              <div className="graph-column">

                <div className="column-title">
                  Downstream impact
                </div>

                {impact.affected_automations?.length === 0 ? (

                  <div className="empty-state">
                    No downstream dependencies found.
                  </div>

                ) : (

                  impact.affected_automations.map(
                    (automation, index) => (

                      <div
                        className="automation-node affected-node"
                        key={`${automation.automation_id}-${index}`}
                      >

                        <div className="node-number">

                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}

                        </div>

                        <div className="node-content">

                          <div className="node-label">
                            DEPENDENCY
                          </div>

                          <div className="node-name">
                            {automation.automation_name}
                          </div>

                          <div className="depth">

                            {automation.dependency_depth}{" "}

                            hop
                            {automation.dependency_depth !== 1
                              ? "s"
                              : ""}

                            {" "}away

                          </div>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>

        )}

      </section>

    </div>
  );
}

export default ImpactAnalyzer;