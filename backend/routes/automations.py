from fastapi import APIRouter, HTTPException

from database import driver


router = APIRouter(
    prefix="/api/automations",
    tags=["Automations"]
)


AUTOMATION_GRAPH_QUERY = """
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
ORDER BY automation.name
"""


@router.get("")
def get_automations():
    try:
        with driver.session() as session:
            result = session.run(AUTOMATION_GRAPH_QUERY)

            automations = {}

            for record in result:
                automation_id = record["automation_id"]

                if automation_id not in automations:
                    automations[automation_id] = {
                        "id": automation_id,
                        "name": record["automation_name"],
                        "description": record["description"],
                        "actions": []
                    }

                automations[automation_id]["actions"].append({
                    "id": record["action_id"],
                    "name": record["action_name"],
                    "tool": {
                        "id": record["tool_id"],
                        "name": record["tool_name"]
                    } if record["tool_id"] else None,
                    "reads": record["reads"],
                    "writes": record["writes"]
                })

            return {
                "success": True,
                "count": len(automations),
                "automations": list(automations.values())
            }

    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to retrieve automation data: {str(error)}"
        )