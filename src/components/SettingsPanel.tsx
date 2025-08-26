import React, { useState, useEffect, useCallback } from "react";
import { type Node } from "@xyflow/react";

interface SettingsPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onClearSelection: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onClearSelection,
}) => {
  const [textValue, setTextValue] = useState("");

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setTextValue(String(selectedNode.data.text || ""));
    }
  }, [selectedNode]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: number;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (selectedNode) {
            onNodeUpdate(selectedNode.id, {
              ...selectedNode.data,
              text: value,
            });
          }
        }, 300) as unknown as number;
      };
    })(),
    [selectedNode, onNodeUpdate]
  );

  // Handle text change with debouncing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    debouncedUpdate(newValue);
  };

  if (!selectedNode) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select a node to edit its properties
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No node selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Node Settings
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {String(selectedNode.data.label || selectedNode.type || "Node")}{" "}
              Node
            </p>
          </div>
          <button
            onClick={onClearSelection}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close settings"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Node ID Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node ID
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              {selectedNode.id}
            </div>
          </div>

          {/* Node Type Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Type
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              {selectedNode.type || "default"}
            </div>
          </div>

          {/* Text Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Text
            </label>
            <textarea
              value={textValue}
              onChange={handleTextChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Enter message text here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Changes are saved automatically after 300ms
            </p>
          </div>

          {/* Position Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                  {Math.round(selectedNode.position.x)}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                  {Math.round(selectedNode.position.y)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
