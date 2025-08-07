import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import NodesPanel from "./components/NodesPanel";

const initialNodes: Node[] = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is a valid node type
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (reactFlowBounds) {
        const position: XYPosition = reactFlowInstance?.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode: Node = {
          id: getId(),
          type: "default",
          position,
          data: { label: `${type} node` },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance]
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
        <div
          className="flex-1 bg-white border-r border-gray-200 relative"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          />
        </div>

        {/* Sidebar - Nodes Panel */}
        <aside className="w-full h-50 md:w-80 md:h-auto bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
          <NodesPanel />
        </aside>
      </main>
    </div>
  );
}

export default App;
