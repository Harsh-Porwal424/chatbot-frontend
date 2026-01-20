import React from "react";
import { Plus, PanelLeftClose, PanelLeft, Target, Trash2 } from "lucide-react";
import { ClearDemandLogoMini } from "../shared/Logo";

export const Sidebar = ({
  sidebarOpen,
  onToggle,
  onNewChat,
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  agents,
}) => {
  const handleSidebarToggle = (open) => {
    onToggle(open);
  };

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
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-16"}`}
    >
      {/* Sidebar Header - Logo Area */}
      <div
        className={`p-3 border-b border-gray-100 ${sidebarOpen ? "" : "flex justify-center"}`}
      >
        {sidebarOpen ? (
          /* OPEN STATE: Logo + ClearDemand + Toggle Button */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClearDemandLogoMini size={36} />
              <div>
                <h1 className="font-bold text-gray-900 text-sm leading-tight">
                  ClearDemand
                </h1>
                <p className="text-xs text-gray-500">
                  Pricing Intelligence
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSidebarToggle(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              title="Close sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        ) : (
          /* CLOSED STATE: Logo only, toggle appears on hover */
          <div
            className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
            onClick={() => handleSidebarToggle(true)}
          >
            {/* Logo - visible by default, hidden on hover */}
            <div className="transition-opacity duration-200 group-hover:opacity-0">
              <ClearDemandLogoMini size={36} />
            </div>

            {/* Toggle button - hidden by default, shown on hover (replaces logo) */}
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <div className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <PanelLeft size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div
        className={`p-3 ${sidebarOpen ? "" : "flex justify-center"}`}
      >
        {sidebarOpen ? (
          <button
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors w-full"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        ) : (
          <button
            onClick={onNewChat}
            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Chat History - Only when sidebar is open */}
      {sidebarOpen && (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
            Recent
          </p>
          {chats.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <p className="text-sm text-gray-400">No chats yet</p>
              <p className="text-xs mt-1 text-gray-400">Start a conversation</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {chats.map((chat) => {
                const chatAgent = agents.find((a) => a.id === chat.agent);
                const ChatAgentIcon = chatAgent?.icon || Target;
                return (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`group w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left cursor-pointer ${
                      currentChatId === chat.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: chatAgent?.bgColor || "#e5e7eb",
                      }}
                    >
                      <ChatAgentIcon
                        size={12}
                        style={{ color: chatAgent?.color || "#6b7280" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${
                        currentChatId === chat.id ? "text-gray-900 font-medium" : "text-gray-700"
                      }`}>
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-400">{formatTimestamp(chat.updated_at)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                      title="Delete chat"
                    >
                      <Trash2 size={12} className="text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
