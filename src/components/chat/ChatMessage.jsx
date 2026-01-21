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
                const content = item.content || '';
                
                return (
                  <div key={idx} className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Use custom table renderer with cell click handler
                          table: (props) => {
                            return (
                              <div className="my-4">
                                <MarkdownTableRenderer
                                  {...props}
                                  onCellClick={(cellValue, headerText) => {
                                    // When user clicks on an ID cell, send it as a message
                                    onSendMessage(cellValue);
                                  }}
                                />
                              </div>
                            );
                          },
                          p: ({ children }) => (
                            <p className="mb-4 text-sm leading-relaxed text-slate-700 last:mb-0">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-slate-900">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              } else if (item.type === 'follow-up') {
                return (
                  <div key={idx} className="mt-4 flex flex-wrap gap-3">
                    {item.content.map((suggestion, qIdx) => {
                      // Determine icon and styling based on suggestion content
                      let Icon = ChevronRight;
                      let buttonStyle = "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300";
                      const lowerSuggestion = suggestion.toLowerCase();

                      if (lowerSuggestion.includes('yes') || lowerSuggestion.includes('proceed') || lowerSuggestion.includes('create')) {
                        Icon = Check;
                        buttonStyle = "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 hover:border-green-300";
                      } else if (lowerSuggestion.includes('no') || lowerSuggestion.includes('cancel') || lowerSuggestion.includes('modify')) {
                        Icon = X;
                        buttonStyle = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300";
                      } else if (lowerSuggestion.includes('show') || lowerSuggestion.includes('list') || lowerSuggestion.includes('example')) {
                        Icon = Search;
                        buttonStyle = "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300";
                      } else if (lowerSuggestion.includes('explain') || lowerSuggestion.includes('how') || lowerSuggestion.includes('what')) {
                        Icon = Lightbulb;
                        buttonStyle = "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300";
                      }

                      return (
                        <button
                          key={qIdx}
                          onClick={() => {
                            onSendMessage(suggestion);
                          }}
                          className={`inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium border rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group ${buttonStyle}`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
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
