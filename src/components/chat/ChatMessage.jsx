import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownTableRenderer } from "@/components/MarkdownTableRenderer";
import {
  Sparkles,
  ChevronRight,
  Check,
  X,
  Search,
  Lightbulb,
} from "lucide-react";

export const ChatMessage = ({
  message,
  onOpenContext,
  onSendMessage,
}) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[75%] ${isUser ? "text-right" : ""}`}
      >
        {isUser ? (
          <div className="px-4 py-2.5 rounded-xl text-sm bg-blue-600 text-white rounded-br-sm">
            {message.content}
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            {/* Render new data structure */}
            {message.data && message.data.map((item, idx) => {
              if (item.type === 'readme') {
                return (
                  <div key={idx} className="prose prose-sm max-w-none text-sm leading-relaxed border rounded-xl px-4 py-3 shadow-sm text-slate-900 bg-white border-slate-200 mb-2">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Use custom table renderer with cell click handler
                        table: (props) => {
                          return (
                            <MarkdownTableRenderer
                              {...props}
                              onCellClick={(cellValue, headerText) => {
                                // When user clicks on an ID cell, send it as a message
                                onSendMessage(cellValue);
                              }}
                            />
                          );
                        }
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
                      let Icon = ChevronRight;
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
                            onSendMessage(suggestion);
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
              <div className="px-4 py-2.5 rounded-xl text-sm bg-gray-100 text-gray-800 rounded-bl-sm">
                {message.content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
