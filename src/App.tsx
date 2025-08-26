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
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import { NodesPanel } from "./components/NodesPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { nodeTypes } from "./components/nodes";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = []; // Remove invalid initial edge

let nodeId = 0;
const getId = () => `node_${++nodeId}`;

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { toast } = useToast();

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

  // Enhanced onConnect with validation rules
  const onConnect = useCallback(
    (params: Connection) => {
      // Validation: Only one edge from any source handle is permitted
      const existingEdgeFromSource = edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (existingEdgeFromSource) {
        console.warn(
          "Connection rejected: Only one edge per source handle is allowed"
        );
        return; // Reject the connection
      }

      // Validation: Prevent self-connections
      if (params.source === params.target) {
        console.warn("Connection rejected: Self-connections are not allowed");
        return;
      }

      // If validation passes, add the edge
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
      console.log("Connection added:", params);
    },
    [edges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node);
  }, []);

  // Handle canvas click to clear selection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node updates from settings panel
  const onNodeUpdate = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: newData } : node
      )
    );

    // Update selected node to reflect changes
    setSelectedNode((selected) =>
      selected?.id === nodeId ? { ...selected, data: newData } : selected
    );
  }, []);

  // Clear selection handler
  const onClearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is a valid node type
      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      if (reactFlowBounds && reactFlowInstance) {
        const position: XYPosition = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create new node with unique ID and positioned where dropped
        const newNode: Node = {
          id: getId(),
          type: nodeType, // Use the actual node type from drag data
          position,
          data: {
            label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
            text: "", // Default empty text as requested
            message: "", // For message nodes
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance]
  );

  const handleSave = () => {
    // Check if there are more than one node
    if (nodes.length > 1) {
      // Find nodes with empty target handles (no incoming connections)
      const nodesWithEmptyTargets = nodes.filter((node) => {
        // Check if this node has any incoming edges
        const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
        return !hasIncomingEdge;
      });

      // If more than one node has empty target handles, show error
      if (nodesWithEmptyTargets.length > 1) {
        toast({
          variant: "destructive",
          title: "Cannot save flow",
          description: `Error: ${nodesWithEmptyTargets.length} nodes have empty target handles. Only one node can have an empty target handle.`,
        });
        return;
      }
    }

    // If validation passes, save the flow
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage (you can replace this with your preferred storage method)
    localStorage.setItem("chatbot-flow", JSON.stringify(flowData));

    console.log("Flow saved successfully:", flowData);

    toast({
      title: "Flow saved",
      description: "Your chatbot flow has been saved successfully.",
    });
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
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          />
        </div>

        {/* Sidebar - Dynamic Panel */}
        <aside className="w-full h-50 md:w-80 md:h-auto bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onNodeUpdate={onNodeUpdate}
              onClearSelection={onClearSelection}
            />
          ) : (
            <NodesPanel />
          )}
        </aside>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
