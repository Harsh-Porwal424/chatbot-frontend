/**
 * Tree Search Utilities
 * Enterprise-level search functionality for hierarchical tree structures
 */

/**
 * Recursively searches through a tree and returns matching nodes along with their ancestors
 * @param {Array} nodes - Array of tree nodes
 * @param {string} searchTerm - The search term to match
 * @param {boolean} filterMode - If true, returns only matching nodes and ancestors. If false, returns all nodes but marks matches
 * @returns {Array} Filtered tree nodes
 */
export const filterTree = (nodes, searchTerm, filterMode = true) => {
  if (!searchTerm || !searchTerm.trim()) {
    return nodes;
  }

  const term = searchTerm.toLowerCase().trim();

  const filterNode = (node) => {
    const nameMatches = node.name.toLowerCase().includes(term);
    const idMatches = node.id.toLowerCase().includes(term);
    const matches = nameMatches || idMatches;

    // Process children recursively
    let filteredChildren = [];
    if (node.children && node.children.length > 0) {
      filteredChildren = node.children
        .map(child => filterNode(child))
        .filter(child => child !== null);
    }

    // In filter mode, only return nodes that match or have matching descendants
    if (filterMode) {
      if (matches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
          _isMatch: matches,
          _hasMatchingDescendants: filteredChildren.length > 0
        };
      }
      return null;
    }

    // In expand mode, return all nodes but mark matches
    return {
      ...node,
      children: node.children || [],
      _isMatch: matches,
      _hasMatchingDescendants: filteredChildren.some(c => c._isMatch || c._hasMatchingDescendants)
    };
  };

  return nodes.map(node => filterNode(node)).filter(node => node !== null);
};

/**
 * Finds all matching node IDs in the tree
 * @param {Array} nodes - Array of tree nodes
 * @param {string} searchTerm - The search term to match
 * @returns {Set} Set of matching node IDs
 */
export const findAllMatches = (nodes, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return new Set();
  }

  const term = searchTerm.toLowerCase().trim();
  const matches = new Set();

  const findMatches = (node) => {
    const nameMatches = node.name.toLowerCase().includes(term);
    const idMatches = node.id.toLowerCase().includes(term);

    if (nameMatches || idMatches) {
      matches.add(node.id);
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(child => findMatches(child));
    }
  };

  nodes.forEach(node => findMatches(node));
  return matches;
};

/**
 * Finds the path from root to all matching nodes and returns IDs that should be expanded
 * @param {Array} nodes - Array of tree nodes
 * @param {string} searchTerm - The search term to match
 * @returns {Set} Set of node IDs that should be expanded to reveal matches
 */
export const findExpandedNodesForMatches = (nodes, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return new Set();
  }

  const term = searchTerm.toLowerCase().trim();
  const expandedIds = new Set();

  const findPath = (node, path = []) => {
    const nameMatches = node.name.toLowerCase().includes(term);
    const idMatches = node.id.toLowerCase().includes(term);
    const currentPath = [...path, node.id];

    if (nameMatches || idMatches) {
      // Add all ancestors to expanded set (except the match itself)
      path.forEach(id => expandedIds.add(id));
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(child => findPath(child, currentPath));
    }
  };

  nodes.forEach(node => findPath(node, []));
  return expandedIds;
};

/**
 * Counts total number of matches in the tree
 * @param {Array} nodes - Array of tree nodes
 * @param {string} searchTerm - The search term to match
 * @returns {number} Total count of matching nodes
 */
export const countMatches = (nodes, searchTerm) => {
  return findAllMatches(nodes, searchTerm).size;
};

/**
 * Highlights matching text in a string
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The term to highlight
 * @returns {Array} Array of text segments with highlight flags
 */
export const highlightText = (text, searchTerm) => {
  if (!searchTerm || !searchTerm.trim() || !text) {
    return [{ text, highlight: false }];
  }

  const term = searchTerm.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  const segments = [];
  let lastIndex = 0;

  let index = lowerText.indexOf(term);
  while (index !== -1) {
    // Add non-highlighted text before match
    if (index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, index),
        highlight: false
      });
    }

    // Add highlighted match
    segments.push({
      text: text.substring(index, index + term.length),
      highlight: true
    });

    lastIndex = index + term.length;
    index = lowerText.indexOf(term, lastIndex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      highlight: false
    });
  }

  return segments;
};

/**
 * Checks if a node or any of its descendants match the search term
 * @param {Object} node - Tree node
 * @param {string} searchTerm - The search term to match
 * @returns {boolean} True if node or descendants match
 */
export const nodeHasMatch = (node, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return false;
  }

  const term = searchTerm.toLowerCase().trim();

  const checkNode = (n) => {
    const nameMatches = n.name.toLowerCase().includes(term);
    const idMatches = n.id.toLowerCase().includes(term);

    if (nameMatches || idMatches) {
      return true;
    }

    if (n.children && n.children.length > 0) {
      return n.children.some(child => checkNode(child));
    }

    return false;
  };

  return checkNode(node);
};
