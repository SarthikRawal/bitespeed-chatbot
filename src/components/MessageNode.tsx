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

  return (
    <div className="px-2 py-1 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[100px]">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100 text-sm">
          💬
        </div>
        <div className="ml-2 flex-1">
          <div className="text-sm font-semibold">{data.label}</div>
          <div className="text-gray-500 mt-1">
            {isEditing ? (
              <textarea
                value={text}
                onChange={handleTextChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-full p-1 text-xs border border-gray-300 rounded resize-none"
                rows={1}
                autoFocus
                placeholder="Enter message text..."
              />
            ) : (
              <div
                onDoubleClick={handleDoubleClick}
                className="cursor-pointer p-1 min-h-[16px] text-xs"
              >
                {text || "Double-click to edit"}
              </div>
            )}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default MessageNode;
