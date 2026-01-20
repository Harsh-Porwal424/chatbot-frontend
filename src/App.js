import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  Send,
  Paperclip,
  Lightbulb,
  Zap,
  Clock,
  TrendingUp,
  FileText,
  Trash2,
  Layers,
  HelpCircle,
  Target,
  Bell,
  Maximize2,
  X,
  Sparkles,
  Package,
  MapPin,
  PlayCircle,
  LayoutGrid,
  FileCheck,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Component imports
import { ClearDemandLogo } from "./components/shared/Logo";
import { Sidebar } from "./components/chat/Sidebar";
import { ChatMessage } from "./components/chat/ChatMessage";
import { QuickActionCard } from "./components/chat/QuickActionCard";
import { AgentDropdown } from "./components/agents/AgentDropdown";
import { NotificationPanel } from "./components/notifications/NotificationPanel";
import { ContextPanel } from "./components/context/ContextPanel";

// Data imports
import { agents } from "./data/agents";
import {
  mockNotifications,
  productGroups,
  locationGroups,
  scenariosData,
} from "./data/mockData";

// Utils imports
import { BACKEND_URL, CHAT_URL, AGENT_MAPPING } from "./utils/constants";
import { generateTempSessionId, getSkuCount, getStoreCount } from "./utils/helpers";

// Configure axios
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.headers.common['X-Bungee-Tenant'] = 'meijer';

// Utility functions for localStorage management
const STORAGE_KEY = 'cleardemand_chats';

const loadChatsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading chats from localStorage:", error);
    return [];
  }
};

const saveChatsToStorage = (chats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chats to localStorage:", error);
  }
};

const generateChatId = () => {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to calculate count of leaf nodes recursively
const calculateNodeCount = (node) => {
  if (!node.children || node.children.length === 0) {
    return 1; // Leaf node counts as 1
  }
  return node.children.reduce((sum, child) => sum + calculateNodeCount(child), 0);
};

// Helper function to transform API hierarchy to expected format
const transformHierarchyNode = (node) => {
  const transformed = {
    id: node.node_id,
    name: node.node_name,
    level: node.node_level,
    children: node.children ? node.children.map(transformHierarchyNode) : []
  };
  // Calculate count based on children
  transformed.count = calculateNodeCount(transformed);
  return transformed;
};

// Helper function to find node by ID in hierarchy and return its details
const findNodeById = (nodes, nodeId) => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return { name: node.name, level: node.level };
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
};

export default function ClearDemandEnterprise() {
  // State hooks
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState("chat");
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productSelection, setProductSelection] = useState(new Set());
  const [locationSelection, setLocationSelection] = useState(new Set());
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [allScenarios, setAllScenarios] = useState([]);
  const [totalScenariosCount, setTotalScenariosCount] = useState(0);
  const [allPanels, setAllPanels] = useState([]);
  const [totalPanelsCount, setTotalPanelsCount] = useState(0);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [allRules, setAllRules] = useState([]);
  const [totalRulesCount, setTotalRulesCount] = useState(0);
  const [selectedRules, setSelectedRules] = useState(new Set());
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [productHierarchy, setProductHierarchy] = useState([]);
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [filteredProductHierarchy, setFilteredProductHierarchy] = useState(null);
  const [filteredLocationHierarchy, setFilteredLocationHierarchy] = useState(null);
  const [selectedProductNodeName, setSelectedProductNodeName] = useState(null);
  const [selectedLocationNodeName, setSelectedLocationNodeName] = useState(null);
  const [contextPanelActiveTab, setContextPanelActiveTab] = useState("scenarios");

  // Refs
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch product hierarchy once on mount
  useEffect(() => {
    const fetchProductHierarchy = async () => {
      try {
        const response = await axios.get('/api/v1/pricing-rules/products/hierarchy');
        // Transform the hierarchy including the root node
        if (response.data && response.data.root) {
          const rootNode = {
            id: response.data.root.node_id,
            name: response.data.root.node_name,
            children: response.data.children ? response.data.children.map(transformHierarchyNode) : []
          };
          // Calculate count for the root node
          rootNode.count = calculateNodeCount(rootNode);
          setProductHierarchy([rootNode]);
        } else {
          setProductHierarchy([]);
        }
      } catch (error) {
        console.error('Error fetching product hierarchy:', error);
        // Set empty array on error to prevent crashes
        setProductHierarchy([]);
      }
    };
    fetchProductHierarchy();
  }, []);

  // Fetch location hierarchy once on mount
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        const response = await axios.get('/api/v1/pricing-rules/locations/hierarchy');
        // Transform the hierarchy including the root node
        if (response.data && response.data.root) {
          const rootNode = {
            id: response.data.root.node_id,
            name: response.data.root.node_name,
            children: response.data.children ? response.data.children.map(transformHierarchyNode) : []
          };
          // Calculate count for the root node
          rootNode.count = calculateNodeCount(rootNode);
          setLocationHierarchy([rootNode]);
        } else {
          setLocationHierarchy([]);
        }
      } catch (error) {
        console.error('Error fetching location hierarchy:', error);
        // Set empty array on error to prevent crashes
        setLocationHierarchy([]);
      }
    };
    fetchLocationHierarchy();
  }, []);

  // Fetch filtered product hierarchy based on product_node_id
  const fetchFilteredProductHierarchy = async (productNodeId) => {
    if (!productNodeId) {
      setFilteredProductHierarchy(null);
      setSelectedProductNodeName(null);
      return;
    }

    try {
      const response = await axios.get(`/api/v1/pricing-rules/products/hierarchy?product_node_id=${productNodeId}`);
      // Transform the hierarchy including the root node
      if (response.data && response.data.root) {
        const rootNode = {
          id: response.data.root.node_id,
          name: response.data.root.node_name,
          children: response.data.children ? response.data.children.map(transformHierarchyNode) : []
        };
        // Calculate count for the root node
        rootNode.count = calculateNodeCount(rootNode);
        setFilteredProductHierarchy([rootNode]);
        // Store the product node name for context
        setSelectedProductNodeName(response.data.root.node_name);
      } else {
        setFilteredProductHierarchy(null);
        setSelectedProductNodeName(null);
      }
    } catch (error) {
      console.error('Error fetching filtered product hierarchy:', error);
      setFilteredProductHierarchy(null);
      setSelectedProductNodeName(null);
    }
  };

  // Fetch filtered location hierarchy based on location_node_id
  const fetchFilteredLocationHierarchy = async (locationNodeId) => {
    if (!locationNodeId) {
      setFilteredLocationHierarchy(null);
      setSelectedLocationNodeName(null);
      return;
    }

    try {
      const response = await axios.get(`/api/v1/pricing-rules/locations/hierarchy?location_node_id=${locationNodeId}`);
      // Transform the hierarchy including the root node
      if (response.data && response.data.root) {
        const rootNode = {
          id: response.data.root.node_id,
          name: response.data.root.node_name,
          children: response.data.children ? response.data.children.map(transformHierarchyNode) : []
        };
        // Calculate count for the root node
        rootNode.count = calculateNodeCount(rootNode);
        setFilteredLocationHierarchy([rootNode]);
        // Store the location node name for context
        setSelectedLocationNodeName(response.data.root.node_name);
      } else {
        setFilteredLocationHierarchy(null);
        setSelectedLocationNodeName(null);
      }
    } catch (error) {
      console.error('Error fetching filtered location hierarchy:', error);
      setFilteredLocationHierarchy(null);
      setSelectedLocationNodeName(null);
    }
  };

  // Fetch all scenarios with optional filter
  const fetchAllScenarios = async (filter = "") => {
    try {
      const url = filter
        ? `/api/v1/pricing-rules/scenario?search=${encodeURIComponent(filter)}`
        : '/api/v1/pricing-rules/scenario';
      const response = await axios.get(url);
      const transformedScenarios = response.data.items.map(item => ({
        id: item.scenario_id,
        name: item.name,
        description: item.description || 'No description available'
      }));
      setAllScenarios(transformedScenarios);
      setTotalScenariosCount(response.data.total_items || 0);
    } catch (error) {
      console.error('Error fetching all scenarios:', error);
    }
  };

  // Fetch all scenarios once on mount
  useEffect(() => {
    fetchAllScenarios();
  }, []);

  // Fetch panels for a scenario with optional filter
  const fetchPanelsForScenario = async (scenarioId, filter = "") => {
    if (!scenarioId) {
      setAllPanels([]);
      setTotalPanelsCount(0);
      return;
    }

    try {
      let url = `/api/v1/pricing-rules/panel?scenario_id=${scenarioId}`;
      if (filter) {
        url += `&search=${encodeURIComponent(filter)}`;
      }
      const response = await axios.get(url);
      const transformedPanels = response.data.items.map(item => ({
        id: item.panel_id,
        name: item.panel_name,
        description: item.comment || 'No description available',
        priority: item.priority,
        location_node_id: item.location_node_id,
        location_group_id: item.location_group_id,
        product_group_id: item.product_group_id,
        product_node_id: item.product_node_id,
        scenarioId: item.scenario_id
      }));
      setAllPanels(transformedPanels);
      setTotalPanelsCount(response.data.total_items || 0);
    } catch (error) {
      console.error('Error fetching panels:', error);
      setAllPanels([]);
      setTotalPanelsCount(0);
    }
  };

  // Fetch panels when scenario is selected
  useEffect(() => {
    fetchPanelsForScenario(selectedScenario);
  }, [selectedScenario]);

  // Fetch rules for a panel with optional filter
  const fetchRulesForPanel = async (panelId, filter = "") => {
    if (!panelId) {
      setAllRules([]);
      setTotalRulesCount(0);
      return;
    }

    try {
      let url = `/api/v1/pricing-rules/panel/${panelId}/rules`;
      if (filter) {
        url += `?search=${encodeURIComponent(filter)}`;
      }
      const response = await axios.get(url);
      const transformedRules = response.data.items.map(item => ({
        id: item.rule_id,
        panelId: item.panel_id,
        rank: item.hard_rule_rank,
        ruleType: item.rule_sub_type_desc,
        description: item.rule_desc || 'No description available',
        active: item.active,
        hardRuleFlag: item.hard_rule_flag,
        intelligentRuleFlag: item.intelligent_rule_flag,
        priceTypeDesc: item.price_type_desc,
        ruleTypeDesc: item.rule_type_desc,
        ruleWeight: item.rule_weight,
        valid: item.valid
      }));
      setAllRules(transformedRules);
      setTotalRulesCount(response.data.total_records || 0);
    } catch (error) {
      console.error('Error fetching rules:', error);
      setAllRules([]);
      setTotalRulesCount(0);
    }
  };

  // Fetch rules when panel is selected
  useEffect(() => {
    fetchRulesForPanel(selectedPanel);
  }, [selectedPanel]);

  // Load chats from localStorage on mount
  useEffect(() => {
    const loadedChats = loadChatsFromStorage();
    setChats(loadedChats);
  }, []);

  // Load messages when currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chats.find(chat => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages || []);
        setSessionId(currentChat.session_id || null);
        setChatId(currentChat.chat_id || null);
      }
    } else {
      setMessages([]);
      setSessionId(null);
      setChatId(null);
    }
  }, [currentChatId, chats]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track screen size for responsive panel behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-focus input when user starts typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTypingInInput = activeElement.tagName === 'INPUT' ||
                              activeElement.tagName === 'TEXTAREA' ||
                              activeElement.isContentEditable;

      if (isTypingInInput) return;

      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

      if (e.key.length === 1) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setInputValue(prev => prev + e.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Computed values
  const selectedScenarioData = allScenarios.find((s) => s.id === selectedScenario);
  const selectedPanelData = allPanels.find((p) => p.id === selectedPanel);
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Calculate total SKU count from all product selections
  const totalSkuCount = Array.from(productSelection).reduce(
    (sum, nodeId) => sum + getSkuCount(nodeId, productHierarchy, productGroups),
    0,
  );

  // Calculate total store count from all location selections
  const totalStoreCount = Array.from(locationSelection).reduce(
    (sum, nodeId) => sum + getStoreCount(nodeId, locationHierarchy, locationGroups),
    0,
  );

  // Event handlers
  const handleSidebarToggle = (open) => {
    if (!isLargeScreen && open) {
      setContextPanelOpen(false);
    }
    setSidebarOpen(open);
  };

  const handleScopePanelToggle = () => {
    if (!isLargeScreen && !contextPanelOpen) {
      setSidebarOpen(false);
    }
    setContextPanelOpen(!contextPanelOpen);
  };

  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setSelectedPanel(null);
    setProductSelection(new Set());
    setLocationSelection(new Set());
    setSelectedRules(new Set());
    // Clear filtered hierarchies and node names when scenario changes
    setFilteredProductHierarchy(null);
    setFilteredLocationHierarchy(null);
    setSelectedProductNodeName(null);
    setSelectedLocationNodeName(null);
    // Clear chat_id to start a new conversation
    setChatId(null);
  };

  const handlePanelSelect = (panelId) => {
    setSelectedPanel(panelId);
    setSelectedRules(new Set());

    if (panelId) {
      const panel = allPanels.find((p) => p.id === panelId);
      if (panel) {
        // Set selections
        if (panel.product_node_id) {
          setProductSelection(new Set([panel.product_node_id]));
        }
        if (panel.location_node_id) {
          setLocationSelection(new Set([panel.location_node_id]));
        }

        // Fetch filtered hierarchies based on panel's node IDs
        fetchFilteredProductHierarchy(panel.product_node_id);
        fetchFilteredLocationHierarchy(panel.location_node_id);
      }
    } else {
      setProductSelection(new Set());
      setLocationSelection(new Set());
      // Clear filtered hierarchies and node names when no panel is selected
      setFilteredProductHierarchy(null);
      setFilteredLocationHierarchy(null);
      setSelectedProductNodeName(null);
      setSelectedLocationNodeName(null);
    }
  };

  const handleCreateNewScenario = () => {
    setSelectedScenario(null);
    setSelectedPanel(null);
    setProductSelection(new Set());
    setLocationSelection(new Set());
    setSelectedRules(new Set());
    // Clear filtered hierarchies and node names
    setFilteredProductHierarchy(null);
    setFilteredLocationHierarchy(null);
    setSelectedProductNodeName(null);
    setSelectedLocationNodeName(null);
    // Clear chat_id to start a new conversation
    setChatId(null);
    setInputValue("Create a new scenario: ");
    inputRef.current?.focus();
  };

  const handleCreateNewPanel = () => {
    setSelectedPanel(null);
    setSelectedRules(new Set());
    // Clear filtered hierarchies and node names
    setFilteredProductHierarchy(null);
    setFilteredLocationHierarchy(null);
    setSelectedProductNodeName(null);
    setSelectedLocationNodeName(null);
    setInputValue("Create a new panel: ");
    inputRef.current?.focus();
  };

  const handleCreateNewRule = () => {
    setSelectedRules(new Set());
    setInputValue("Create a new rule: ");
    inputRef.current?.focus();
  };

  const updateChatInStorage = (chatId, updates) => {
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, ...updates, updated_at: new Date().toISOString() };
        }
        return chat;
      });
      saveChatsToStorage(updatedChats);
      return updatedChats;
    });
  };

  const handleNewChat = () => {
    // Clear current chat to start a new one
    setCurrentChatId(null);
    setMessages([]);
    setSessionId(null);
    setChatId(null);
    setInputValue("");

    // Clear all selections
    setSelectedScenario(null);
    setSelectedPanel(null);
    setSelectedRules(new Set());
    setProductSelection(new Set());
    setLocationSelection(new Set());

    // Clear filtered hierarchies and node names
    setFilteredProductHierarchy(null);
    setFilteredLocationHierarchy(null);
    setSelectedProductNodeName(null);
    setSelectedLocationNodeName(null);

    toast.success("Ready for new conversation");
  };

  const deleteChat = (chatIdToDelete) => {
    const updatedChats = chats.filter(chat => chat.id !== chatIdToDelete);
    setChats(updatedChats);
    saveChatsToStorage(updatedChats);

    if (currentChatId === chatIdToDelete) {
      setCurrentChatId(null);
      setMessages([]);
      setSessionId(null);
      setChatId(null);
    }
    toast.success("Chat deleted");
  };

  const handleSendMessage = async (messageText = null) => {
    // Use provided messageText or fall back to inputValue
    const userMessage = messageText || inputValue;

    // Ensure userMessage is a string and not empty
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim() || isLoading) return;

    // Only clear inputValue if we're sending from input field (not from follow-up)
    if (!messageText) {
      setInputValue("");
    }
    setIsLoading(true);

    let activeChatId = currentChatId;
    let currentSessionId = sessionId;
    let currentChatIdForBackend = chatId;

    // Create new chat if none exists
    if (!activeChatId) {
      const newChat = {
        id: generateChatId(),
        title: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
        agent: currentAgent,
        messages: [],
        session_id: generateTempSessionId(),
        chat_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setChats(prev => {
        const updated = [newChat, ...prev];
        saveChatsToStorage(updated);
        return updated;
      });

      activeChatId = newChat.id;
      currentSessionId = newChat.session_id;
      setCurrentChatId(activeChatId);
      setSessionId(currentSessionId);
    }

    // Add user message
    const userMsg = { role: "user", content: userMessage };
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      updateChatInStorage(activeChatId, { messages: updated });
      return updated;
    });

    const context = {};

    if (selectedScenario) {
      context.scenario = {
        id: selectedScenario.toString(),
        name: selectedScenarioData?.name || null
      };
    }

    if (selectedPanel) {
      context.panel = {
        id: selectedPanel.toString(),
        name: selectedPanelData?.name || null
      };
    }

    if (selectedRules.size > 0) {
      // Single-select: get first rule only
      const ruleId = Array.from(selectedRules)[0];
      const rule = allRules.find(r => r.id === ruleId);
      context.rule = {
        id: ruleId.toString(),
        type: rule?.ruleType || null,
        rank: rule?.rank || null
      };
    }

    if (productSelection.size > 0) {
      const firstProductSelection = Array.from(productSelection)[0];
      if (firstProductSelection.startsWith("group_")) {
        const groupId = firstProductSelection.replace("group_", "");
        const group = productGroups.find(g => g.id.toString() === groupId);
        context.product_group = {
          id: groupId,
          name: group?.name || null
        };
      } else {
        // Find node details from hierarchy (works for both filtered and full hierarchy)
        const hierarchyToSearch = filteredProductHierarchy || productHierarchy;
        const nodeDetails = findNodeById(hierarchyToSearch, firstProductSelection);
        context.product_node = {
          id: firstProductSelection,
          name: nodeDetails?.name || selectedProductNodeName || null,
          level: nodeDetails?.level || null
        };
      }
    }

    if (locationSelection.size > 0) {
      const firstLocationSelection = Array.from(locationSelection)[0];
      if (firstLocationSelection.startsWith("group_")) {
        const groupId = firstLocationSelection.replace("group_", "");
        const group = locationGroups.find(g => g.id.toString() === groupId);
        context.location_group = {
          id: groupId,
          name: group?.name || null
        };
      } else {
        // Find node details from hierarchy (works for both filtered and full hierarchy)
        const hierarchyToSearch = filteredLocationHierarchy || locationHierarchy;
        const nodeDetails = findNodeById(hierarchyToSearch, firstLocationSelection);
        context.location_node = {
          id: firstLocationSelection,
          name: nodeDetails?.name || selectedLocationNodeName || null,
          level: nodeDetails?.level || null
        };
      }
    }

    const payload = {
      user_input: userMessage,
      session_id: currentSessionId,
      agent: AGENT_MAPPING[currentAgent] || "chat_assistant",
    };

    // Add chat_id if it exists (for conversation continuity)
    if (currentChatIdForBackend) {
      payload.chat_id = currentChatIdForBackend;
    }

    if (Object.keys(context).length > 0) {
      payload.context = context;
    }

    try {
      const response = await axios.post(CHAT_URL, payload);
      const { response: apiResponse, session_id: newSessionId, chat_id: newChatId, ui_hints } = response.data;

      // Store session_id and chat_id for conversation continuity
      if (newSessionId && newSessionId !== currentSessionId) {
        setSessionId(newSessionId);
        updateChatInStorage(activeChatId, { session_id: newSessionId });
      }
      if (newChatId && newChatId !== currentChatIdForBackend) {
        setChatId(newChatId);
        updateChatInStorage(activeChatId, { chat_id: newChatId });
      }

      if (apiResponse.status === 'failure') {
        toast.error(apiResponse.message || "Failed to get response from AI");
        setIsLoading(false);
        return;
      }

      // Add AI response to messages and save to chat
      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            role: "assistant",
            data: apiResponse.data
          }
        ];
        updateChatInStorage(activeChatId, { messages: updated });
        return updated;
      });

      // Process UI hints if present
      if (ui_hints && Array.isArray(ui_hints) && ui_hints.length > 0) {
        await processUIHints(ui_hints);
      }

    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            role: "assistant",
            data: [{
              type: 'readme',
              content: "Due to some technical issues, we cannot process this request. Please try again later."
            }]
          }
        ];
        updateChatInStorage(activeChatId, { messages: updated });
        return updated;
      });

      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  // Process UI hints from chat response
  const processUIHints = async (uiHints) => {
    if (!uiHints || !Array.isArray(uiHints)) return;

    // Process RELOAD_DATA actions first, then other actions
    const reloadActions = [];
    const otherActions = [];

    for (const hint of uiHints) {
      if (hint.action === "RELOAD_DATA") {
        reloadActions.push(hint);
      } else {
        otherActions.push(hint);
      }
    }

    // Process reload actions first
    for (const hint of reloadActions) {
      const { target, filter } = hint;
      
      if (target === "scenarios") {
        await fetchAllScenarios(filter || "");
      } else if (target === "panels") {
        // Reload panels for currently selected scenario
        if (selectedScenario) {
          await fetchPanelsForScenario(selectedScenario, filter || "");
        }
      } else if (target === "rules") {
        // Reload rules for currently selected panel
        if (selectedPanel) {
          await fetchRulesForPanel(selectedPanel, filter || "");
        }
      }
    }

    // Process other actions (OPEN_SIDEBAR, SELECT_ITEM, SHOW_CREATE_FORM)
    for (const hint of otherActions) {
      const { action, tab, target, filter, item_id } = hint;

      switch (action) {
        case "OPEN_SIDEBAR":
          // Open context panel and set active tab
          if (tab && ["scenarios", "panels", "rules", "scope"].includes(tab)) {
            setContextPanelActiveTab(tab);
            setContextPanelOpen(true);
            // Also close sidebar if on small screen to make room for context panel
            if (!isLargeScreen) {
              setSidebarOpen(false);
            }
          }
          break;

        case "SELECT_ITEM":
          // Select item based on target and optional item_id
          if (target === "scenario") {
            if (item_id) {
              // Select specific scenario by ID
              const scenario = allScenarios.find(s => s.id.toString() === item_id.toString());
              if (scenario) {
                handleScenarioSelect(scenario.id);
              }
            } else if (allScenarios.length > 0) {
              // Select first scenario if no ID specified
              handleScenarioSelect(allScenarios[0].id);
            }
          } else if (target === "panel") {
            if (item_id) {
              // Select specific panel by ID
              const panel = allPanels.find(p => p.id.toString() === item_id.toString());
              if (panel) {
                handlePanelSelect(panel.id);
              }
            } else if (allPanels.length > 0) {
              // Select first panel if no ID specified
              handlePanelSelect(allPanels[0].id);
            }
          } else if (target === "rule") {
            if (item_id) {
              // Select specific rule by ID
              const rule = allRules.find(r => r.id.toString() === item_id.toString());
              if (rule) {
                setSelectedRules(new Set([rule.id]));
              }
            } else if (allRules.length > 0) {
              // Select first rule if no ID specified
              setSelectedRules(new Set([allRules[0].id]));
            }
          }
          break;

        case "SHOW_CREATE_FORM":
          // Open create dialog based on target
          if (target === "scenario") {
            handleCreateNewScenario();
          } else if (target === "panel") {
            handleCreateNewPanel();
          } else if (target === "rule") {
            handleCreateNewRule();
          }
          break;

        default:
          console.warn(`Unknown UI hint action: ${action}`);
      }
    }
  };

  // Quick actions data
  const quickActions = currentAgent === "chat"
    ? [
        {
          icon: Lightbulb,
          text: "How does ClearDemand pricing work?",
          color: "#F59E0B",
        },
        {
          icon: Zap,
          text: "Explain margin optimization strategies",
          color: "#8B5CF6",
        },
        {
          icon: Clock,
          text: "Show recent pricing changes",
          color: "#10B981",
        },
        {
          icon: TrendingUp,
          text: "Analyze competitor pricing trends",
          color: "#3B82F6",
        },
      ]
    : [
        {
          icon: FileText,
          text: "Create a new pricing rule",
          color: "#1565C0",
        },
        {
          icon: Trash2,
          text: "Delete a pricing scenario",
          color: "#EF4444",
        },
        {
          icon: Layers,
          text: "Create a new pricing panel",
          color: "#10B981",
        },
        {
          icon: HelpCircle,
          text: "What are dimensions in pricing?",
          color: "#8B5CF6",
        },
      ];

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onNewChat={handleNewChat}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onDeleteChat={deleteChat}
        agents={agents}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
          <AgentDropdown
            currentAgent={currentAgent}
            onSelect={setCurrentAgent}
            isOpen={agentDropdownOpen}
            setIsOpen={setAgentDropdownOpen}
            agentsData={agents}
          />

          <div className="flex items-center gap-1">
            {currentAgent === "rules" && (
              <button
                onClick={handleScopePanelToggle}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${contextPanelOpen ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                <Target size={16} />
                <span className="font-medium">Context</span>
              </button>
            )}

            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                className={`p-2 rounded-lg transition-colors relative ${notificationPanelOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-500"}`}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                isOpen={notificationPanelOpen}
                onClose={() => setNotificationPanelOpen(false)}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>

            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Expand"
            >
              <Maximize2 size={18} />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat + Context Panel Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                /* Welcome Screen with 2x2 Grid */
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="max-w-2xl w-full">
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <ClearDemandLogo size={64} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Welcome to ClearDemand
                      </h2>
                      <p className="text-gray-500 text-sm max-w-md mx-auto">
                        {currentAgent === "chat"
                          ? "Your intelligent pricing analyst. Ask me anything about pricing scenarios, strategies, or market insights."
                          : "Create and manage pricing rules with ease. I'll guide you through the process step by step."}
                      </p>
                    </div>

                    {/* 2x2 Grid of Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, i) => (
                        <QuickActionCard
                          key={i}
                          icon={action.icon}
                          text={action.text}
                          color={action.color}
                          onClick={() => handleQuickAction(action.text)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Messages */
                <div className="p-6 space-y-6 max-w-3xl mx-auto">
                  {messages.map((msg, i) => (
                    <ChatMessage
                      key={i}
                      message={msg}
                      onOpenContext={() => setContextPanelOpen(true)}
                      onSendMessage={(text) => {
                        // Send message directly without populating input field
                        handleSendMessage(text);
                      }}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="border rounded-xl px-4 py-3 shadow-sm bg-white border-slate-200">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                {currentAgent === "rules" &&
                  (selectedScenario ||
                    selectedPanel ||
                    productSelection.size > 0 ||
                    locationSelection.size > 0 ||
                    selectedRules.size > 0) && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {selectedScenarioData && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-md text-xs">
                          <PlayCircle size={12} className="text-orange-600" />
                          <span className="text-orange-700 font-medium">
                            {selectedScenarioData.name}
                          </span>
                        </div>
                      )}
                      {selectedPanelData && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-md text-xs">
                          <LayoutGrid size={12} className="text-purple-600" />
                          <span className="text-purple-700 font-medium">
                            {selectedPanelData.name}
                          </span>
                        </div>
                      )}
                      {productSelection.size > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs">
                          <Package size={12} className="text-blue-600" />
                          <span className="text-blue-700 font-medium">
                            {totalSkuCount.toLocaleString()} SKUs
                          </span>
                        </div>
                      )}
                      {locationSelection.size > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs">
                          <MapPin size={12} className="text-green-600" />
                          <span className="text-green-700 font-medium">
                            {totalStoreCount.toLocaleString()} stores
                          </span>
                        </div>
                      )}
                      {selectedRules.size > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-xs">
                          <FileCheck size={12} className="text-indigo-600" />
                          <span className="text-indigo-700 font-medium">
                            {selectedRules.size} rule{selectedRules.size > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                <div className="flex items-end gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                    <Paperclip size={18} className="text-gray-500" />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      currentAgent === "chat"
                        ? "Ask anything about pricing..."
                        : "Describe the rule you want to create..."
                    }
                    className="flex-1 bg-transparent resize-none outline-none text-gray-700 placeholder:text-gray-400 text-sm min-h-[24px] max-h-32 py-2"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`p-2 rounded-lg transition-all flex-shrink-0 ${inputValue.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400"}`}
                  >
                    <Send size={18} />
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">
                  ClearDemand AI can make mistakes. Please verify important information.
                </p>
              </div>
            </div>
          </div>

          {/* Context Panel */}
          {currentAgent === "rules" && (
            <ContextPanel
              isOpen={contextPanelOpen}
              onClose={() => setContextPanelOpen(false)}
              productSelection={productSelection}
              setProductSelection={setProductSelection}
              locationSelection={locationSelection}
              setLocationSelection={setLocationSelection}
              selectedScenario={selectedScenario}
              setSelectedScenario={handleScenarioSelect}
              selectedPanel={selectedPanel}
              setSelectedPanel={handlePanelSelect}
              selectedRules={selectedRules}
              setSelectedRules={setSelectedRules}
              onCreateNewScenario={handleCreateNewScenario}
              onCreateNewPanel={handleCreateNewPanel}
              onCreateNewRule={handleCreateNewRule}
              allScenarios={allScenarios}
              totalScenariosCount={totalScenariosCount}
              allPanels={allPanels}
              totalPanelsCount={totalPanelsCount}
              allRules={allRules}
              totalRulesCount={totalRulesCount}
              productHierarchy={filteredProductHierarchy || productHierarchy}
              locationHierarchy={filteredLocationHierarchy || locationHierarchy}
              productGroups={productGroups}
              locationGroups={locationGroups}
              activeTab={contextPanelActiveTab}
              onActiveTabChange={setContextPanelActiveTab}
            />
          )}
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
