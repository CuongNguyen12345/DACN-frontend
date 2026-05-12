import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import api from "@/services/api";
import { wsService } from "@/services/websocket";
import { useAuth } from "@/context/AuthContext";

const NotificationContext = createContext(null);

const STORAGE_PREFIX = "edu4all_notifications";
const STREAK_REMINDER_HOUR = 20;

const todayKey = () => dayjs().format("YYYY-MM-DD");

const buildStorageKey = (userId) => `${STORAGE_PREFIX}_${userId || "guest"}`;

const seedNotifications = () => [
  {
    id: "welcome",
    type: "system",
    title: "Hệ thống",
    message: "Chào mừng bạn đến với Edu4All!",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: "sample-qna-reply",
    type: "qna",
    title: "Có phản hồi mới",
    message: "Giáo viên đã phản hồi câu hỏi của bạn trong mục Hỏi đáp.",
    createdAt: dayjs().subtract(2, "hour").toISOString(),
    isRead: false,
  },
  {
    id: "sample-new-exam",
    type: "exam",
    title: "Đề kiểm tra mới",
    message: "Giáo viên vừa tạo đề kiểm tra mới. Hãy vào thư viện đề để luyện tập nhé.",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    isRead: true,
    actionUrl: "/practice",
  },
];

const normalizeNotification = (notification) => ({
  createdAt: new Date().toISOString(),
  isRead: false,
  ...notification,
});

const formatRelativeTime = (createdAt) => {
  const created = dayjs(createdAt);
  const diffMinutes = dayjs().diff(created, "minute");

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = dayjs().diff(created, "hour");
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = dayjs().diff(created, "day");
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return created.format("DD/MM/YYYY");
};

export const NotificationProvider = ({ children }) => {
  const { isLoggedIn, user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const storageKey = useMemo(() => buildStorageKey(user?.id), [user?.id]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setNotifications([]);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      setNotifications(saved ? JSON.parse(saved) : seedNotifications());
    } catch (error) {
      console.error("Không thể đọc danh sách thông báo:", error);
      setNotifications(seedNotifications());
    }
  }, [isLoggedIn, storageKey, user?.id]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [isLoggedIn, notifications, storageKey, user?.id]);

  const addNotification = useCallback((notification, options = {}) => {
    const nextNotification = normalizeNotification(notification);

    setNotifications((prev) => {
      if (prev.some((item) => item.id === nextNotification.id)) {
        return prev;
      }

      return [nextNotification, ...prev].slice(0, 50);
    });

    if (options.showToast) {
      toast(nextNotification.title, {
        description: nextNotification.message,
      });
    }
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const addStreakReminderIfNeeded = useCallback(async () => {
    if (!isLoggedIn || !user?.id || role === "teacher" || role === "admin") return;
    if (new Date().getHours() < STREAK_REMINDER_HOUR) return;

    const date = todayKey();
    const notificationId = `streak-${date}`;

    if (notifications.some((notification) => notification.id === notificationId)) return;

    try {
      const response = await api.get("/api/learning/progress/study-activity");
      const studyDates = response.data?.studyDates || response.data?.studiedDates || [];

      if (studyDates.includes(date)) return;

      const currentStreak = response.data?.currentStreak ?? user.currentStreak ?? 0;

      addNotification(
        {
          id: notificationId,
          type: "streak",
          title: "Giữ streak hôm nay",
          message:
            currentStreak > 0
              ? `Bạn đang có streak ${currentStreak} ngày. Học một bài ngắn trước khi hết ngày để giữ chuỗi nhé.`
              : "Hôm nay bạn chưa học bài nào. Vào học một chút để bắt đầu streak mới nhé.",
          actionUrl: "/course",
        },
        { showToast: true },
      );
    } catch (error) {
      console.error("Không thể kiểm tra streak hôm nay:", error);
    }
  }, [addNotification, isLoggedIn, notifications, role, user]);

  useEffect(() => {
    addStreakReminderIfNeeded();
    const timer = window.setInterval(addStreakReminderIfNeeded, 60 * 1000);

    return () => window.clearInterval(timer);
  }, [addStreakReminderIfNeeded]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const userTopic = `/topic/support/user/${user.id}`;
    const examTopic = "/topic/exams/new";

    wsService.connect(() => {
      wsService.subscribe(userTopic, (message) => {
        const senderRole = (message.senderRole || "").toLowerCase();
        const isTeacherReply = senderRole === "teacher" || senderRole === "admin";

        if (!isTeacherReply || Number(message.senderId) === Number(user.id)) return;

        addNotification(
          {
            id: `qna-${message.id}`,
            type: "qna",
            title: "Có phản hồi mới từ giáo viên",
            message: `${message.senderName || "Giáo viên"} đã phản hồi câu hỏi của bạn${
              message.lessonName ? ` trong bài ${message.lessonName}` : ""
            }.`,
            actionUrl: message.lessonId ? `/course/learning/${message.lessonId}` : "/notification",
          },
          { showToast: true },
        );
      });

      if (role !== "teacher" && role !== "admin") {
        wsService.subscribe(examTopic, (exam) => {
          addNotification(
            {
              id: `exam-${exam.id}`,
              type: "exam",
              title: "Đề kiểm tra mới",
              message: `${exam.title || "Một đề kiểm tra mới"} vừa được tạo${
                exam.subject ? ` cho môn ${exam.subject}` : ""
              }.`,
              actionUrl: "/practice",
            },
            { showToast: true },
          );
        });
      }
    });

    return () => {
      wsService.unsubscribe(userTopic);
      wsService.unsubscribe(examTopic);
    };
  }, [addNotification, isLoggedIn, role, user?.id]);

  const value = useMemo(() => {
    const sortedNotifications = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      notifications: sortedNotifications,
      unreadCount: sortedNotifications.filter((notification) => !notification.isRead).length,
      addNotification,
      markAsRead,
      markAllAsRead,
      formatRelativeTime,
    };
  }, [addNotification, markAllAsRead, markAsRead, notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
};
