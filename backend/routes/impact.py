from pathlib import Path

from fastapi import APIRouter, HTTPException

from backend.database import driver


router = APIRouter(
    prefix="/api/impact",
    tags=["Impact Analysis"]
)


QUERY_FILE = (
    Path(__file__).resolve().parent.parent
    / "queries"
    / "impact_analysis.cypher"
)


def load_impact_query():
    return QUERY_FILE.read_text(encoding="utf-8")


@router.get("/{field_id}")
def get_impact_analysis(field_id: str):
    try:
        query = load_impact_query()

        with driver.session() as session:
            result = session.run(
                query,
                field_id=field_id
            )

            record = result.single()

        if record is None:
            return {
                "success": True,
                "field_id": field_id,
                "message": "Data field not found.",
                "source_automations": [],
                "affected_automations": []
            }

        source_automations = record["source_automations"]
        raw_affected = record["affected_automations"]

        affected_by_id = {}

        for item in raw_affected:
            if item["automation_id"] is None:
                continue

            automation_id = item["automation_id"]

            if (
                automation_id not in affected_by_id
                or item["dependency_depth"]
                < affected_by_id[automation_id]["dependency_depth"]
            ):
                affected_by_id[automation_id] = item

        affected_automations = sorted(
            affected_by_id.values(),
            key=lambda item: (
                item["dependency_depth"],
                item["automation_name"]
            )
        )

        return {
            "success": True,
            "field_id": record["field_id"],
            "field_name": record["field_name"],
            "source_automations": source_automations,
            "affected_automations": affected_automations
        }

    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Impact analysis failed: {str(error)}"
        )