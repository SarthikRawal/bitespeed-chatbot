import React from "react";
import { Handle, Position } from "@xyflow/react";

interface MessageNodeData {
  label: string;
  message?: string;
}

interface MessageNodeProps {
  data: MessageNodeData;
  isConnectable: boolean;
}

const MessageNode: React.FC<MessageNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          💬
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">
            {data.message || "Click to edit message"}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default MessageNode;
