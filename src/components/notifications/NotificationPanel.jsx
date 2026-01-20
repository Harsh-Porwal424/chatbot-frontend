import { useRef, useEffect, useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

// Notification Panel Component
export const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  setNotifications,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      )
        onClose();
    };
    if (isOpen)
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isOpen, onClose]);

  const handleMarkAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    );
  const handleMarkAllAsRead = () =>
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true })),
    );

  const filteredNotifications = notifications
    .filter((n) => {
      if (activeTab === "all") return true;
      if (activeTab === "in_progress")
        return (
          n.status === "started" || n.status === "in_progress"
        );
      if (activeTab === "completed")
        return n.status === "completed";
      if (activeTab === "failed") return n.status === "failed";
      return true;
    })
    .slice(0, 10);

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;
  const inProgressCount = notifications.filter(
    (n) => n.status === "started" || n.status === "in_progress",
  ).length;
  const completedCount = notifications.filter(
    (n) => n.status === "completed",
  ).length;
  const failedCount = notifications.filter(
    (n) => n.status === "failed",
  ).length;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
      style={{ maxHeight: "480px" }}
    >
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">View All</span>
          <span
            className={`text-[10px] ${activeTab === "all" ? "text-blue-500" : "text-gray-400"}`}
          >
            ({notifications.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("in_progress")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "in_progress" ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">In Progress</span>
          <span
            className={`text-[10px] ${activeTab === "in_progress" ? "text-amber-500" : "text-gray-400"}`}
          >
            ({inProgressCount})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "completed" ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">Completed</span>
          <span
            className={`text-[10px] ${activeTab === "completed" ? "text-emerald-500" : "text-gray-400"}`}
          >
            ({completedCount})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("failed")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${activeTab === "failed" ? "text-red-600 border-b-2 border-red-500 bg-red-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          <span className="block">Failed</span>
          <span
            className={`text-[10px] ${activeTab === "failed" ? "text-red-500" : "text-gray-400"}`}
          >
            ({failedCount})
          </span>
        </button>
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: "360px" }}
      >
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell size={40} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No messages</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};
