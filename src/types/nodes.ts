import MessageNode from "../components/MessageNode";

export const nodeTypes = {
  message: MessageNode,
};

export interface NodeTypeDefinition {
  type: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
}

export const NODE_TYPES: NodeTypeDefinition[] = [
  {
    type: "message",
    label: "Message",
    description: "Send a message to users",
    icon: "💬",
  },
  {
    type: "textMessage",
    label: "Text Message",
    description: "Send a text message to users",
    icon: "💬",
  },
  {
    type: "condition",
    label: "Condition",
    description: "Branch flow based on conditions",
    icon: "🔀",
  },
  {
    type: "delay",
    label: "Delay",
    description: "Add a delay in the conversation",
    icon: "⏱️",
  },
];
