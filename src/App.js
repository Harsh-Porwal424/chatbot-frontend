import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PanelLeftClose,
  Plus,
  ArrowUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Trash2,
  Menu,
  BarChart3,
  Search,
  LineChart,
  Lightbulb,
  CornerDownRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import clearDemandLogo from "@/images/clear_demand_logo-removebg-preview.png";
import { DataTable } from "@/components/DataTable";
import { MarkdownTableRenderer } from "@/components/MarkdownTableRenderer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';

// Configure axios to skip ngrok warning
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.headers.common['User-Agent'] = 'CustomClient';

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

const generateTempSessionId = () => {
  return `temp-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateChatId = () => {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chats from localStorage on mount
  useEffect(() => {
    const loadedChats = loadChatsFromStorage();
    setChats(loadedChats);
  }, []);

  // Load messages when currentChatId changes (only when switching chats, not when chats array updates)
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chats.find(chat => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages || []);
      }
    } else {
      setMessages([]);
    }
  }, [currentChatId, chats]);

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        if (textareaRef.current) {
          textareaRef.current.focus();
          setInputValue(prev => prev + e.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const createNewChat = () => {
    // Just clear the current chat, don't create a new one yet
    // A new chat will be created when the user sends their first message
    setCurrentChatId(null);
    setMessages([]);
    toast.success("Ready for new conversation");
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    saveChatsToStorage(updatedChats);

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
    toast.success("Chat deleted");
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

  const sendMessage = async (messageText) => {
    // Use provided message or input value
    const messageToSend = messageText || inputValue;

    if (!messageToSend.trim() || isLoading) return;

    setInputValue("");
    setIsLoading(true);

    let chatId = currentChatId;
    let currentSessionId = null;

    // Get or create chat
    if (!chatId) {
      // Create new chat
      const newChat = {
        id: generateChatId(),
        title: messageToSend.substring(0, 50) + (messageToSend.length > 50 ? '...' : ''),
        session_id: generateTempSessionId(),
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setChats(prev => {
        const updated = [newChat, ...prev];
        saveChatsToStorage(updated);
        return updated;
      });

      chatId = newChat.id;
      currentSessionId = newChat.session_id;
      setCurrentChatId(chatId);

      // Add user message
      const userMessage = { role: "user", content: messageToSend };
      setMessages([userMessage]);

      // Update the newly created chat with the message
      updateChatInStorage(chatId, { messages: [userMessage] });
    } else {
      // Use existing chat
      const currentChat = chats.find(chat => chat.id === chatId);
      if (!currentChat) {
        setIsLoading(false);
        toast.error("Chat not found");
        return;
      }

      currentSessionId = currentChat.session_id;

      // Add user message optimistically
      const userMessage = { role: "user", content: messageToSend };
      const updatedMessages = [...(currentChat.messages || []), userMessage];
      setMessages(updatedMessages);

      // Update chat with user message
      updateChatInStorage(chatId, { messages: updatedMessages });
    }

    try {
      // Call backend /chat endpoint (non-streaming)
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        user_input: messageToSend,
        session_id: currentSessionId
      });

      // Extract response structure from backend
      const { response: apiResponse, session_id: newSessionId } = response.data;

      // Debug: Log the response to check structure
      console.log("Backend response:", response.data);
      console.log("API Response:", apiResponse);
      console.log("API Response type:", typeof apiResponse);

      // Check status
      if (apiResponse.status === 'failure') {
        toast.error(apiResponse.message || "Failed to get response from AI");
        // Remove the optimistically added user message
        const currentChat = chats.find(chat => chat.id === chatId);
        if (currentChat) {
          setMessages(currentChat.messages || []);
        }
        setIsLoading(false);
        return;
      }

      // Add AI message to current messages with new data structure
      setMessages(prev => {
        const aiMessage = {
          role: "assistant",
          data: apiResponse.data // Array with type: readme/follow-up/table
        };
        const finalMessages = [...prev, aiMessage];

        // Update chat with final messages and real session_id
        updateChatInStorage(chatId, {
          messages: finalMessages,
          session_id: newSessionId
        });

        return finalMessages;
      });

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const errorMessage = {
          role: "assistant",
          data: [{
            type: 'readme',
            content: "Due to some technical issues, we cannot process this request. Please try again later."
          }]
        };
        const finalMessages = [...prev, errorMessage];

        // Update chat with error message
        updateChatInStorage(chatId, { messages: finalMessages });

        return finalMessages;
      });
      toast.error("Failed to send message. Please try again.");

    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const suggestionCards = [
    {
      icon: BarChart3,
      text: "Create a new pricing scenario",
      color: "blue"
    },
    {
      icon: Search,
      text: "Show me available panels",
      color: "indigo"
    },
    {
      icon: LineChart,
      text: "Explain CPI rules with examples",
      color: "emerald"
    },
    {
      icon: Lightbulb,
      text: "Explain different type of rules present?",
      color: "amber"
    },
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    if (hours < 168) return `${Math.floor(hours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-[240px] border-r flex flex-col fixed lg:relative h-full z-20 border-slate-200 bg-white"
          >
            {/* Header */}
            <div className="px-3 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <img
                    src={clearDemandLogo}
                    alt="ClearDemand Logo"
                    className="w-7 h-7 object-contain"
                  />
                  <div>
                    <span className="font-semibold text-sm text-slate-900">
                      ClearDemand
                    </span>
                    <p className="text-[10px] leading-tight text-slate-500">
                      AI Assistant
                    </p>
                  </div>
                </div>
                <Button
                  data-testid="sidebar-toggle-btn"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-7 w-7 p-0 hover:bg-slate-100"
                >
                  <PanelLeftClose className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="px-3 pt-3 pb-2">
              <Button
                data-testid="new-chat-btn"
                onClick={createNewChat}
                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-medium"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                New Conversation
              </Button>
            </div>

            {/* Chat History */}
            <ScrollArea className="flex-1 px-1">
              <div className="py-2">
                <h3 className="text-[11px] font-semibold px-3 mb-2 uppercase tracking-wider text-slate-500">
                  Recent Chats
                </h3>
                {chats.length === 0 ? (
                  <div className="px-3 py-8 text-center">
                    <p className="text-sm text-slate-400">No chats yet</p>
                    <p className="text-xs mt-1 text-slate-400">Start a conversation</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {chats.map((chat) => (
                      <motion.div
                      key={chat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      data-testid={`chat-item-${chat.id}`}
                      onClick={() => {
                        setCurrentChatId(chat.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`group px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        currentChatId === chat.id
                          ? "bg-slate-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${
                            currentChatId === chat.id
                              ? "text-slate-900 font-medium"
                              : "text-slate-700"
                          }`}>
                            {chat.title}
                          </p>
                          <p className="text-xs mt-0.5 text-slate-400 truncate">
                            {formatTimestamp(chat.updated_at)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-7">
                          <Button
                            data-testid={`delete-chat-btn-${chat.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={(e) => deleteChat(chat.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200">
              <p className="text-[10px] text-center text-slate-400">
                Powered by ClearDemand AI · v1.0
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button
                data-testid="menu-toggle-btn"
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <img
                src={clearDemandLogo}
                alt="ClearDemand Logo"
                className="w-7 h-7 object-contain"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900">
                  ClearDemand AI
                </span>
                <p className="text-[10px] leading-tight hidden sm:block text-slate-500">
                  Your pricing intelligence assistant
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <ScrollArea className="flex-1 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6 md:px-8 py-6">
            {messages.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 rounded-xl border-2 flex items-center justify-center mb-6 shadow-sm p-2 bg-white border-slate-200">
                  <img
                    src={clearDemandLogo}
                    alt="ClearDemand Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-slate-900">
                  Welcome to ClearDemand
                </h2>
                <p className="text-base max-w-lg leading-relaxed mb-10 text-slate-600">
                  Your intelligent pricing analyst powered by AI. Ask me anything about pricing scenarios, panels, rules, or learn about different rule types and pricing strategies.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestionCards.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`suggestion-card-${index}`}
                        onClick={() => {
                          sendMessage(suggestion.text);
                        }}
                        className="group p-4 border rounded-xl hover:shadow-sm text-left transition-all bg-white border-slate-200 hover:border-slate-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors bg-blue-50 group-hover:bg-blue-100">
                            <Icon className="w-4 h-4 text-blue-600" strokeWidth={2} />
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-slate-700">
                            {suggestion.text}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div data-testid="messages-container" className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div
                        data-testid={`user-message-${index}`}
                        className="max-w-[85%] md:max-w-[70%] text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm leading-relaxed shadow-sm bg-blue-600"
                      >
                        {message.content}
                      </div>
                    ) : (
                      <div className="flex gap-3 max-w-full" data-testid={`ai-message-${index}`}>
                        <div className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 p-1 bg-white border-slate-200">
                          <img
                            src={clearDemandLogo}
                            alt="AI"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Render new data structure */}
                          {message.data && message.data.map((item, idx) => {
                            if (item.type === 'readme') {
                              return (
                                <div key={idx} className="prose prose-sm max-w-none text-sm leading-relaxed border rounded-xl px-4 py-3 shadow-sm text-slate-900 bg-white border-slate-200 mb-2">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      // Use custom table renderer
                                      table: MarkdownTableRenderer
                                    }}
                                  >
                                    {item.content}
                                  </ReactMarkdown>
                                </div>
                              );
                            } else if (item.type === 'follow-up') {
                              return (
                                <div key={idx} className="mt-3 flex flex-wrap gap-2">
                                  {item.content.map((suggestion, qIdx) => {
                                    // Determine icon based on suggestion content
                                    let Icon = CornerDownRight;
                                    const lowerSuggestion = suggestion.toLowerCase();

                                    if (lowerSuggestion.includes('yes') || lowerSuggestion.includes('proceed') || lowerSuggestion.includes('create')) {
                                      Icon = Check;
                                    } else if (lowerSuggestion.includes('no') || lowerSuggestion.includes('cancel')) {
                                      Icon = X;
                                    } else if (lowerSuggestion.includes('show') || lowerSuggestion.includes('list') || lowerSuggestion.includes('example')) {
                                      Icon = Search;
                                    } else if (lowerSuggestion.includes('explain') || lowerSuggestion.includes('how') || lowerSuggestion.includes('what')) {
                                      Icon = Lightbulb;
                                    }

                                    return (
                                      <button
                                        key={qIdx}
                                        onClick={() => {
                                          sendMessage(suggestion);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow group"
                                      >
                                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                                        <span>{suggestion}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            }
                            return null;
                          })}

                          {/* Legacy support for old messages with content property */}
                          {message.content && !message.data && (
                            <div className="prose prose-sm max-w-none text-sm leading-relaxed border rounded-xl px-4 py-3 shadow-sm text-slate-900 bg-white border-slate-200">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            </div>
                          )}

                          <div className="flex gap-1 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const textToCopy = message.data
                                  ? message.data.map(item => item.type === 'readme' ? item.content : '').join('\n\n')
                                  : message.content;
                                copyToClipboard(textToCopy);
                              }}
                              className="h-7 px-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-slate-400 hover:text-green-600 hover:bg-green-50"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 p-1 bg-white border-slate-200">
                      <img
                        src={clearDemandLogo}
                        alt="AI"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="border rounded-xl px-4 py-3 shadow-sm bg-white border-slate-200">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 md:p-6 border-slate-200 bg-gradient-to-b from-white to-slate-50/30">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="relative flex items-end gap-2 border-2 rounded-2xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 shadow-lg shadow-slate-200/50 px-4 py-3 border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-200/60">
                <Textarea
                  ref={textareaRef}
                  data-testid="message-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about pricing and demand..."
                  className="flex-1 min-h-[40px] max-h-[200px] py-2 px-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] leading-relaxed resize-none bg-transparent text-slate-900 placeholder:text-slate-400"
                  rows={1}
                />
                <Button
                  data-testid="send-message-btn"
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:bg-slate-200 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0 mb-0.5"
                >
                  <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                </Button>
              </div>
            </div>
            <p className="text-xs text-center pt-4 text-slate-500">
              ClearDemand AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
