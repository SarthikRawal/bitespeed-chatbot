import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

interface MessageNodeData {
  label: string;
  text?: string;
  message?: string;
}

interface MessageNodeProps {
  data: MessageNodeData;
  isConnectable: boolean;
}

const MessageNode: React.FC<MessageNodeProps> = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || data.message || "");

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update the node data here if needed
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // Truncate text for preview
  const getPreviewText = () => {
    if (!text) return "Double Click to add message text";
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  };

  return (
    <div className="bg-white border-2 border-blue-400 rounded-lg shadow-md min-w-[200px] max-w-[250px]">
      {/* Target handle - allows multiple incoming edges */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#3b82f6", width: 8, height: 8 }}
      />

      {/* Header */}
      <div className="bg-blue-500 text-white px-3 py-2 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm">💬</span>
          <span className="text-sm font-semibold">Send Message</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3">
        {isEditing ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            autoFocus
            placeholder="Enter your message text here..."
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="cursor-pointer p-2 min-h-[60px] text-sm text-gray-700 border border-dashed border-gray-300 rounded hover:border-gray-400 transition-colors"
          >
            {getPreviewText()}
          </div>
        )}
      </div>

      {/* Source handle - limited to one outgoing edge */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#3b82f6", width: 8, height: 8 }}
      />
    </div>
  );
};

export default MessageNode;
