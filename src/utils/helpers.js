// Utility functions for session management
export const generateTempSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to find path to a node in hierarchy
export const findPathToNode = (nodes, targetId, currentPath = []) => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return currentPath;
    }
    if (node.children) {
      const path = findPathToNode(node.children, targetId, [
        ...currentPath,
        node.id,
      ]);
      if (path) return path;
    }
  }
  return null;
};

// Helper function to get SKU count from a node ID
export const getSkuCount = (nodeId, productHierarchy, productGroups) => {
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node.count !== undefined ? node.count : 1;
      }
      if (node.children) {
        const found = findNode(node.children);
        if (found !== null) return found;
      }
    }
    return null;
  };
  if (nodeId.startsWith("group_")) {
    const group = productGroups.find((g) => `group_${g.id}` === nodeId);
    return group?.items || 0;
  }
  return findNode(productHierarchy) || 0;
};

// Helper function to get store count from a node ID
export const getStoreCount = (nodeId, locationHierarchy, locationGroups) => {
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node.count !== undefined ? node.count : 1;
      }
      if (node.children) {
        const found = findNode(node.children);
        if (found !== null) return found;
      }
    }
    return null;
  };
  if (nodeId.startsWith("group_")) {
    const group = locationGroups.find((g) => `group_${g.id}` === nodeId);
    return group?.items || 0;
  }
  return findNode(locationHierarchy) || 0;
};

// Helper function to get rule type styling
export const getRuleTypeStyle = (type) => {
  switch (type) {
    case "Price":
      return {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    case "CPI":
      return {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
      };
    case "Parity":
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
      };
    case "Margin":
      return {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
      };
    case "Markup":
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
      };
  }
};

// Helper function to get dot color for indicators
export const getDotColor = (color) => {
  switch (color) {
    case "orange":
      return "bg-orange-500";
    case "purple":
      return "bg-purple-500";
    case "indigo":
      return "bg-indigo-500";
    case "teal":
      return "bg-teal-500";
    case "blue":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};
