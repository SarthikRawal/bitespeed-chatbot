import { useCallback, useState } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";

const initialNodes: Node[] = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save button clicked");
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header with Save button */}
      <header className="h-15 bg-white border-b border-gray-200 flex items-center justify-between px-5 shadow-sm">
        <h1 className="text-xl md:text-2xl text-gray-800 font-semibold">
          Chatbot Flow Builder
        </h1>
        <button
          className="bg-indigo-600 text-white border-0 px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-indigo-700 active:bg-indigo-800"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Canvas area for React Flow */}
        <div className="flex-1 bg-white border-r border-gray-200 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          />
        </div>

        {/* Sidebar for controls and settings */}
        <aside className="w-full h-50 md:w-75 md:h-auto bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
          <div className="p-5 flex-1">
            <h3 className="text-lg text-gray-800 mb-4 font-semibold">
              Controls
            </h3>
            <p className="text-gray-500 text-sm leading-6">
              Drag and drop nodes here
            </p>
            {/* TODO: Add node controls and settings panel */}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
