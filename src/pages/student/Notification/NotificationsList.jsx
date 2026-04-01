import React, { useState } from "react";
import { 
  Bell, Check, CheckCircle2, Clock, 
  Info, AlertTriangle, MessageCircle, FileText, GraduationCap 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data
const initialNotifications = [
  {
    id: 1,
    type: "exam",
    title: "Kết quả bài thi",
    message: "Tuyệt vời! Bạn đã đạt 9.5 điểm trong bài thi Toán học Giữa kỳ.",
    time: "10 phút trước",
    isRead: false,
  },
  {
    id: 2,
    type: "course",
    title: "Bài giảng mới",
    message: "Giáo viên vừa tải lên tài liệu mới cho khóa học Vật lý 12.",
    time: "2 giờ trước",
    isRead: false,
  },
  {
    id: 3,
    type: "system",
    title: "Bảo trì hệ thống",
    message: "Hệ thống sẽ tiến hành bảo trì định kỳ từ 2h00 - 4h00 sáng mai.",
    time: "5 giờ trước",
    isRead: true,
  },
  {
    id: 4,
    type: "alert",
    title: "Sắp hết hạn nộp bài",
    message: "Chú ý: Bài tập Hóa học của bạn sẽ hết hạn trong 12 giờ tới.",
    time: "1 ngày trước",
    isRead: true,
  },
  {
    id: 5,
    type: "qna",
    title: "Có phản hồi mới",
    message: "Giáo viên đã trả lời câu hỏi của bạn trong mục Hỏi đáp.",
    time: "2 ngày trước",
    isRead: true,
  },
];

const NotificationsList = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // 'all' hoặc 'unread'

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Lọc danh sách thông báo để hiển thị
  const displayedNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  // Xử lý đánh dấu 1 thông báo là đã đọc
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Xử lý đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Chọn icon và màu sắc dựa trên loại thông báo
  const getNotificationStyle = (type) => {
    switch (type) {
      case "exam":
        return { icon: FileText, bg: "bg-emerald-100", color: "text-emerald-600" };
      case "course":
        return { icon: GraduationCap, bg: "bg-blue-100", color: "text-blue-600" };
      case "alert":
        return { icon: AlertTriangle, bg: "bg-red-100", color: "text-red-600" };
      case "qna":
        return { icon: MessageCircle, bg: "bg-purple-100", color: "text-purple-600" };
      case "system":
      default:
        return { icon: Info, bg: "bg-slate-100", color: "text-slate-600" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Thông báo của bạn</h1>
            <p className="text-slate-500 text-sm">Cập nhật những thông tin mới nhất về học tập</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <Card className="border-slate-200 shadow-sm">
        {/* Bộ lọc Tabs */}
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "pb-2 text-sm font-semibold transition-colors relative",
                filter === "all" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Tất cả
              {filter === "all" && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "pb-2 text-sm font-semibold transition-colors relative flex items-center gap-2",
                filter === "unread" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Chưa đọc
              {unreadCount > 0 && (
                <Badge variant="secondary" className={cn("px-1.5 py-0 text-xs", filter === "unread" ? "bg-blue-100 text-blue-700" : "")}>
                  {unreadCount}
                </Badge>
              )}
              {filter === "unread" && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
          </div>
        </CardHeader>

        {/* Danh sách thông báo */}
        <CardContent className="p-0">
          {displayedNotifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Không có thông báo nào</h3>
              <p className="text-slate-500">Bạn đã cập nhật mọi thứ. Hãy quay lại sau nhé!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayedNotifications.map((notification) => {
                const style = getNotificationStyle(notification.type);
                const Icon = style.icon;

                return (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-4 sm:p-6 transition-all hover:bg-slate-50 flex gap-4 cursor-pointer",
                      !notification.isRead ? "bg-blue-50/30" : "opacity-75"
                    )}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    {/* Icon */}
                    <div className="shrink-0 pt-1">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", style.bg, style.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-base font-semibold", 
                          !notification.isRead ? "text-slate-900" : "text-slate-700"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <span className="h-2.5 w-2.5 bg-blue-600 rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsList;