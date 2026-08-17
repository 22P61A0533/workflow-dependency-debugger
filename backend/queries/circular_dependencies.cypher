MATCH path =
    (start:Automation)-[:DEPENDS_ON*2..10]->(start)
RETURN
    [node IN nodes(path) | {
        id: node.id,
        name: node.name
    }] AS cycle,
    length(path) AS cycle_length
ORDER BY cycle_length;