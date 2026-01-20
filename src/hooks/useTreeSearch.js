import { useState, useMemo, useEffect } from 'react';
import {
  filterTree,
  countMatches,
  findExpandedNodesForMatches
} from '../utils/treeSearch';

/**
 * Custom hook for managing tree search state and logic
 * @param {Array} treeData - The tree data to search
 * @param {Set} currentExpandedIds - Currently expanded node IDs
 * @param {Function} setExpandedIds - Function to update expanded IDs
 * @returns {Object} Search state and handlers
 */
export const useTreeSearch = (treeData, currentExpandedIds, setExpandedIds) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('filter'); // 'filter' or 'expand'

  // Filter the tree based on search term and mode
  const filteredTree = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) {
      return treeData;
    }

    const isFilterMode = searchMode === 'filter';
    return filterTree(treeData, searchTerm, isFilterMode);
  }, [treeData, searchTerm, searchMode]);

  // Count total matches
  const matchCount = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) {
      return 0;
    }
    return countMatches(treeData, searchTerm);
  }, [treeData, searchTerm]);

  // Auto-expand nodes in expand mode
  useEffect(() => {
    if (searchMode === 'expand' && searchTerm && searchTerm.trim()) {
      const nodesToExpand = findExpandedNodesForMatches(treeData, searchTerm);

      // Merge with existing expanded IDs
      const mergedExpanded = new Set([...currentExpandedIds, ...nodesToExpand]);
      setExpandedIds(mergedExpanded);
    }
  }, [searchTerm, searchMode, treeData]); // Intentionally not including currentExpandedIds to avoid loops

  // Clear search handler
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Toggle search mode
  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'filter' ? 'expand' : 'filter');
  };

  // Check if search is active
  const isSearchActive = searchTerm && searchTerm.trim().length > 0;

  return {
    searchTerm,
    setSearchTerm,
    searchMode,
    setSearchMode,
    toggleSearchMode,
    filteredTree,
    matchCount,
    clearSearch,
    isSearchActive
  };
};
