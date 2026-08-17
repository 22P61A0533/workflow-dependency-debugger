MATCH (field:DataField {id: $field_id})

OPTIONAL MATCH (sourceAction:Action)-[:WRITES]->(field)
OPTIONAL MATCH (sourceAutomation:Automation)-[:HAS_ACTION]->(sourceAction)

WITH
    field,
    collect(DISTINCT sourceAutomation) AS source_automations

UNWIND source_automations AS sourceAutomation

OPTIONAL MATCH dependencyPath =
    (sourceAutomation)-[:HAS_ACTION]->(:Action)-[:WRITES]->(sharedField:DataField)
    <-[:READS]-(:Action)<-[:HAS_ACTION]-(affectedAutomation:Automation)

WITH
    field,
    source_automations,
    affectedAutomation,
    min(length(dependencyPath)) AS dependency_depth

WHERE affectedAutomation IS NOT NULL
  AND NOT affectedAutomation IN source_automations

WITH
    field,
    source_automations,
    collect(
        DISTINCT {
            automation_id: affectedAutomation.id,
            automation_name: affectedAutomation.name,
            dependency_depth: dependency_depth
        }
    ) AS affected_automations

RETURN
    field.id AS field_id,
    field.name AS field_name,

    [
        sourceAutomation IN source_automations |
        {
            automation_id: sourceAutomation.id,
            automation_name: sourceAutomation.name
        }
    ] AS source_automations,

    affected_automations