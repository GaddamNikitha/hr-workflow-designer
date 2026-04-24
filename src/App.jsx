import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [];
const initialEdges = [];

// Node Colors
const getColor = (type) => {
  switch (type) {
    case "Start":
      return "#4CAF50";
    case "Task":
      return "#2196F3";
    case "Approval":
      return "#FF9800";
    case "End":
      return "#F44336";
    default:
      return "#ccc";
  }
};

// Custom Node
const CustomNode = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "10px",
        background: "#fff",
        border: `2px solid ${getColor(data.type)}`,
        minWidth: "150px",
        textAlign: "center",
        boxShadow: selected ? "0 0 10px #999" : "2px 2px 5px #ccc",
      }}
    >
      <strong style={{ color: getColor(data.type) }}>{data.type}</strong>

      {data.trigger && <div>⚡ {data.trigger}</div>}
      {data.assignee && <div>👤 {data.assignee}</div>}
      {data.date && <div>📅 {data.date}</div>}
      {data.role && <div>🧑‍💼 {data.role}</div>}
      {data.message && <div>💬 {data.message}</div>}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = React.useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add Node
  const addNode = (type) => {
    if (type === "Start" && nodes.some((n) => n.data.type === "Start")) {
      alert("Only one Start node allowed!");
      return;
    }

    const newNode = {
      id: Date.now().toString(),
      type: "custom",
      data: {
        type,
        trigger: "",
        assignee: "",
        date: "",
        role: "",
        message: "",
      },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Update Node 
  const updateNode = (field, value) => {
    const updated = nodes.map((n) =>
      n.id === selectedNode.id
        ? { ...n, data: { ...n.data, [field]: value } }
        : n
    );

    setNodes(updated);

    
    setSelectedNode((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  // Simulation
  const simulate = () => {
    const hasStart = nodes.some((n) => n.data.type === "Start");
    const hasEnd = nodes.some((n) => n.data.type === "End");

    if (!hasStart) return alert("Add a Start node!");
    if (!hasEnd) return alert("Add an End node!");
    if (edges.length === 0) return alert("Connect nodes!");

    const flow = nodes.map((n) => n.data.type).join(" → ");
    alert("Workflow:\n" + flow);
  };

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div style={{ width: "180px", padding: "15px", background: "#111", color: "#fff" }}>
        <h3>Workflow</h3>

        <button onClick={() => addNode("Start")}>Start</button><br />
        <button onClick={() => addNode("Task")}>Task</button><br />
        <button onClick={() => addNode("Approval")}>Approval</button><br />
        <button onClick={() => addNode("End")}>End</button>

        <br /><br />

        <button
          style={{ background: "#4CAF50", color: "white", padding: "8px" }}
          onClick={simulate}
        >
          Simulate
        </button>
      </div>

      {/* Form Panel */}
      {selectedNode && (
        <div style={{ width: "280px", padding: "15px", background: "#f4f4f4" }}>
          <h3>{selectedNode.data.type} Configuration</h3>

          {/* Start */}
          {selectedNode.data.type === "Start" && (
            <input
              placeholder="Trigger (Manual / Auto)"
              value={selectedNode.data.trigger}
              onChange={(e) => updateNode("trigger", e.target.value)}
            />
          )}

          {/* Task */}
          {selectedNode.data.type === "Task" && (
            <>
              <input
                placeholder="Assignee"
                value={selectedNode.data.assignee}
                onChange={(e) => updateNode("assignee", e.target.value)}
              /><br /><br />
              <input
                placeholder="Due Date"
                value={selectedNode.data.date}
                onChange={(e) => updateNode("date", e.target.value)}
              />
            </>
          )}

          {/* Approval */}
          {selectedNode.data.type === "Approval" && (
            <input
              placeholder="Approver Role"
              value={selectedNode.data.role}
              onChange={(e) => updateNode("role", e.target.value)}
            />
          )}

          {/* End */}
          {selectedNode.data.type === "End" && (
            <input
              placeholder="End Message"
              value={selectedNode.data.message}
              onChange={(e) => updateNode("message", e.target.value)}
            />
          )}
        </div>
      )}

      {/* Canvas */}
      <div style={{ height: "100vh", flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(e, node) => setSelectedNode(node)}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

    </div>
  );
}