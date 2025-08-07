import MessageNode from "./MessageNode";

// For now, we'll use MessageNode as a base for other types
// You can create separate components for each type later
export const nodeTypes = {
  message: MessageNode,
  textMessage: MessageNode,
  condition: MessageNode, // TODO: Create ConditionNode component
  delay: MessageNode, // TODO: Create DelayNode component
};
