MATCH (automation:Automation)-[:HAS_ACTION]->(action:Action)
OPTIONAL MATCH (action)-[:USES_TOOL]->(tool:Tool)
OPTIONAL MATCH (action)-[:READS]->(readField:DataField)
OPTIONAL MATCH (action)-[:WRITES]->(writeField:DataField)
RETURN
    automation.id AS automation_id,
    automation.name AS automation_name,
    automation.description AS description,
    action.id AS action_id,
    action.name AS action_name,
    tool.id AS tool_id,
    tool.name AS tool_name,
    collect(DISTINCT readField.name) AS reads,
    collect(DISTINCT writeField.name) AS writes
ORDER BY automation.name;