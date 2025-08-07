export interface NodeTypeDefinition {
  type: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
}

export const NODE_TYPES: NodeTypeDefinition[] = [
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
