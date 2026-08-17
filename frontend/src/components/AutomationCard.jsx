function AutomationCard({ automation }) {
  return (
    <div className="automation-card">

      <div className="automation-card-header">
        <div className="automation-icon">
          ⚡
        </div>

        <div>
          <h3>{automation.name}</h3>

          <span className="automation-id">
            {automation.id}
          </span>
        </div>
      </div>

      <p className="automation-description">
        {automation.description}
      </p>

      {automation.actions?.map((action) => (
        <div
          className="action-block"
          key={action.id}
        >

          <div className="action-header">
            <span className="action-label">
              ACTION
            </span>

            <strong>
              {action.name}
            </strong>
          </div>

          {action.tool && (
            <div className="tool-info">
              <span>Tool</span>

              <strong>
                {action.tool.name}
              </strong>
            </div>
          )}

          <div className="fields-container">

            <div className="field-group">
              <span className="field-label">
                READS
              </span>

              <div className="field-tags">
                {action.reads?.map((field) => (
                  <span
                    className="field-tag read"
                    key={field}
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="field-group">
              <span className="field-label">
                WRITES
              </span>

              <div className="field-tags">
                {action.writes?.map((field) => (
                  <span
                    className="field-tag write"
                    key={field}
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}

export default AutomationCard;