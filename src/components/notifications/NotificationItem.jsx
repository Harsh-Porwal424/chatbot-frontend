import React from "react";
import { Download, RotateCcw } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { StatusBadge } from "./StatusBadge";

// Notification Item Component
export const NotificationItem = ({ notification, onMarkAsRead }) => (
  <div
    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? "bg-blue-50/30" : ""}`}
    onClick={() => onMarkAsRead(notification.id)}
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <StatusIcon status={notification.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm font-medium truncate ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {notification.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={notification.status} />
            <span className="text-xs text-gray-400">
              {notification.timestamp}
            </span>
          </div>
          {notification.status === "completed" && notification.downloadUrl && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            >
              <Download size={12} />
              <span>Download</span>
            </button>
          )}
          {notification.status === "failed" && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <RotateCcw size={12} />
              <span>Retry</span>
            </button>
          )}
        </div>
        {notification.status === "in_progress" &&
          notification.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{notification.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${notification.progress}%` }}
                />
              </div>
            </div>
          )}
        {notification.status === "failed" && notification.error && (
          <p className="text-xs text-red-500 mt-1">{notification.error}</p>
        )}
      </div>
    </div>
  </div>
);
