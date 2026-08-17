import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

/* =========================
   CUSTOM AUTOMATION NODE
========================= */

function AutomationNode({ data }) {
  const isSource = data.type === "source";
  const isField = data.type === "field";
  const isAffected = data.type === "affected";

  return (
    <div
      style={{
        minWidth: isField ? 180 : 230,
        padding: "15px 18px",
        borderRadius: "14px",

        background: "#ffffff",

        border: isField
          ? "2px solid #6672c8"
          : isAffected
          ? "1px solid #e4b15b"
          : "1px solid #cbd2e2",

        boxShadow: isField
          ? "0 8px 24px rgba(88, 100, 190, 0.18)"
          : "0 6px 18px rgba(30, 40, 60, 0.08)",

        textAlign: "left",
      }}
    >
      {isSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: "#6672c8",
            width: 9,
            height: 9,
          }}
        />
      )}

      {isField && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            style={{
              background: "#6672c8",
              width: 9,
              height: 9,
            }}
          />

          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              background: "#6672c8",
              width: 9,
              height: 9,
            }}
          />
        </>
      )}

      {isAffected && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: "#d39b45",
            width: 9,
            height: 9,
          }}
        />
      )}

      <div
        style={{
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "1px",
          color: isField
            ? "#6672c8"
            : isAffected
            ? "#a87424"
            : "#8791a3",
          marginBottom: "6px",
        }}
      >
        {isSource
          ? "SOURCE AUTOMATION"
          : isField
          ? "SHARED DATA FIELD"
          : "DOWNSTREAM DEPENDENCY"}
      </div>

      <div
        style={{
          fontSize: "14px",
          fontWeight: 750,
          color: "#202b40",
          lineHeight: 1.35,
        }}
      >
        {data.label}
      </div>

      {data.depth && (
        <div
          style={{
            marginTop: "7px",
            fontSize: "10px",
            color: "#a87424",
            fontWeight: 650,
          }}
        >
          {data.depth} hop{data.depth !== 1 ? "s" : ""} away
        </div>
      )}
    </div>
  );
}

/* =========================
   NODE TYPES
========================= */

const nodeTypes = {
  automation: AutomationNode,
};

/* =========================
   GRAPH VIEW
========================= */

function GraphView({ impact }) {
  if (!impact) {
    return null;
  }

  const sources = impact.source_automations || [];
  const affected = impact.affected_automations || [];

  /*
   * Center shared field
   */
  const fieldNode = {
    id: "field",
    type: "automation",
    position: {
      x: 300,
      y: 230,
    },
    data: {
      label: impact.field_name || "Selected Field",
      type: "field",
    },
  };

  /*
   * Source automation nodes
   */
  const sourceNodes = sources.map((automation, index) => ({
    id: `source-${automation.automation_id}`,
    type: "automation",
    position: {
      x: index * 280,
      y: 20,
    },
    data: {
      label: automation.automation_name,
      type: "source",
    },
  }));

  /*
   * Downstream automation nodes
   */
  const affectedNodes = affected.map((automation, index) => ({
    id: `affected-${automation.automation_id}`,
    type: "automation",
    position: {
      x: index * 280,
      y: 440,
    },
    data: {
      label: automation.automation_name,
      type: "affected",
      depth: automation.dependency_depth,
    },
  }));

  /*
   * Source -> Field edges
   */
  const sourceEdges = sources.map((automation) => ({
    id: `edge-source-${automation.automation_id}`,
    source: `source-${automation.automation_id}`,
    target: "field",

    animated: true,

    style: {
      stroke: "#6672c8",
      strokeWidth: 2,
    },

    markerEnd: {
      type: "arrowclosed",
      color: "#6672c8",
    },
  }));

  /*
   * Field -> Downstream edges
   */
  const affectedEdges = affected.map((automation) => ({
    id: `edge-affected-${automation.automation_id}`,
    source: "field",
    target: `affected-${automation.automation_id}`,

    animated: true,

    style: {
      stroke: "#d39b45",
      strokeWidth: 2,
    },

    markerEnd: {
      type: "arrowclosed",
      color: "#d39b45",
    },
  }));

  const nodes = [
    ...sourceNodes,
    fieldNode,
    ...affectedNodes,
  ];

  const edges = [
    ...sourceEdges,
    ...affectedEdges,
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "520px",
        marginTop: "20px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e3e7ef",
        background: "#fafbfd",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.25,
          minZoom: 0.65,
          maxZoom: 1.2,
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background
          gap={20}
          size={1}
          color="#e7eaf1"
        />

        <Controls />

        <MiniMap
          nodeColor={(node) => {
            if (node.data?.type === "field") {
              return "#6672c8";
            }

            if (node.data?.type === "affected") {
              return "#d39b45";
            }

            return "#8b94a5";
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default GraphView;