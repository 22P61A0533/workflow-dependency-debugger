from pathlib import Path

from fastapi import APIRouter, HTTPException

from backend.database import driver


router = APIRouter(
    prefix="/api/dependencies",
    tags=["Dependencies"]
)


QUERY_FILE = (
    Path(__file__).resolve().parent.parent
    / "queries"
    / "circular_dependencies.cypher"
)


def load_cycle_query():
    return QUERY_FILE.read_text(encoding="utf-8")


@router.get("/cycles")
def get_circular_dependencies():
    try:
        query = load_cycle_query()

        with driver.session() as session:
            result = session.run(query)

            cycles = [record.data() for record in result]

        return {
            "success": True,
            "cycle_count": len(cycles),
            "cycles": cycles
        }

    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to analyze dependencies: {str(error)}"
        )