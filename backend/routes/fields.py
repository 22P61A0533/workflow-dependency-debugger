from fastapi import APIRouter, HTTPException

from database import driver


router = APIRouter(
    prefix="/api/fields",
    tags=["Data Fields"]
)


FIELDS_QUERY = """
MATCH (field:DataField)
RETURN
    field.id AS id,
    field.name AS name
ORDER BY field.name
"""


@router.get("")
def get_fields():
    try:
        with driver.session() as session:
            result = session.run(FIELDS_QUERY)

            fields = [
                {
                    "id": record["id"],
                    "name": record["name"]
                }
                for record in result
            ]

        return {
            "success": True,
            "count": len(fields),
            "fields": fields
        }

    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to retrieve data fields: {str(error)}"
        )