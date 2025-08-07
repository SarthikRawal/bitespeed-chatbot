import React from "react";
import { NODE_TYPES, type NodeTypeDefinition } from "../types/nodes";

interface NodesPanelProps {
  className?: string;
}

interface DraggableNodeCardProps {
  nodeType: NodeTypeDefinition;
}

const DraggableNodeCard: React.FC<DraggableNodeCardProps> = ({ nodeType }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Store the node type in the drag data
    event.dataTransfer.setData("application/reactflow", nodeType.type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 cursor-grab active:cursor-grabbing transition-all duration-200"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex-shrink-0 text-blue-600">{nodeType.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {nodeType.label}
        </h4>
        {nodeType.description && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {nodeType.description}
          </p>
        )}
      </div>
    </div>
  );
};

const NodesPanel: React.FC<NodesPanelProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Nodes Panel</h3>
        <p className="text-sm text-gray-600 mt-1">
          Drag nodes to the canvas to build your flow
        </p>
      </div>

      {/* Available Nodes */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-3">
          {NODE_TYPES.map((nodeType) => (
            <DraggableNodeCard key={nodeType.type} nodeType={nodeType} />
          ))}
        </div>

        {/* Future nodes placeholder */}
        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              More node types coming soon!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Add new types to NODE_TYPES array
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
