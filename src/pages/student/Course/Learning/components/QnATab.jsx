import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { wsService } from "@/services/websocket";
import api from "@/services/api";
import dayjs from "dayjs";
import { MessageCircle, Send, X } from "lucide-react";

const formatDateTime = (value) => (value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "");

const isTeacherMessage = (message) => {
    const senderRole = (message.senderRole || "").toLowerCase();
    return senderRole === "teacher" || senderRole === "admin";
};

const buildComment = (request, messages = []) => {
    const firstMessage = messages[0];

    return {
        id: request.id,
        requestId: request.id,
        author: request.userName || "Học sinh",
        avatar: request.avatar,
        content: firstMessage?.content || request.title || "",
        datetime: formatDateTime(firstMessage?.createdAt || request.createdAt),
        replies: messages.slice(1).map((message) => ({
            id: message.id,
            senderId: message.senderId,
            author: message.senderName || (isTeacherMessage(message) ? "Giáo viên" : "Học sinh"),
            content: message.content,
            datetime: formatDateTime(message.createdAt),
            senderRole: message.senderRole,
        })),
    };
};

const QnATab = ({ lessonId, subjectId, lessonName }) => {
    const { user, isLoggedIn } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [value, setValue] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyValue, setReplyValue] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const [replyError, setReplyError] = useState("");
    const subscribedRequestsRef = useRef(new Set());

    const getCurrentUserId = useCallback(async () => {
        if (user?.id) return user.id;

        const profileRes = await api.get("/api/auth/profile");
        return profileRes.data?.result?.id;
    }, [user?.id]);

    const appendMessage = useCallback((newMessage) => {
        if (newMessage.lessonId && Number(newMessage.lessonId) !== Number(lessonId)) return;

        setComments((prev) => {
            const existingIndex = prev.findIndex((item) => item.requestId === newMessage.requestId);

            if (existingIndex === -1) {
                return [
                    buildComment(
                        {
                            id: newMessage.requestId,
                            userName: newMessage.senderName,
                            title: newMessage.content,
                            createdAt: newMessage.createdAt,
                        },
                        [newMessage]
                    ),
                    ...prev,
                ];
            }

            const next = [...prev];
            const current = next[existingIndex];

            if (current.id === newMessage.id || current.replies.some((reply) => reply.id === newMessage.id)) {
                return prev;
            }

            next[existingIndex] = {
                ...current,
                replies: [
                    ...current.replies,
                    {
                        id: newMessage.id,
                        senderId: newMessage.senderId,
                        author: newMessage.senderName || (isTeacherMessage(newMessage) ? "Giáo viên" : "Học sinh"),
                        content: newMessage.content,
                        datetime: formatDateTime(newMessage.createdAt),
                        senderRole: newMessage.senderRole,
                    },
                ],
            };

            return next;
        });
    }, [lessonId]);

    const subscribeRequest = useCallback((requestId) => {
        if (!requestId || subscribedRequestsRef.current.has(requestId)) return;

        subscribedRequestsRef.current.add(requestId);
        wsService.subscribe(`/topic/support/request/${requestId}`, appendMessage);
    }, [appendMessage]);

    useEffect(() => {
        if (!isLoggedIn || !user || !lessonId) return;

        let cancelled = false;
        subscribedRequestsRef.current.forEach((requestId) => {
            wsService.unsubscribe(`/topic/support/request/${requestId}`);
        });
        subscribedRequestsRef.current.clear();

        const loadQuestions = async () => {
            setLoading(true);
            try {
                const reqRes = await api.get(`/api/support/requests/user/${user.id}?type=ACADEMIC&lessonId=${lessonId}`);
                const questionRequests = reqRes.data || [];
                const questionItems = await Promise.all(
                    questionRequests.map(async (request) => {
                        const msgRes = await api.get(`/api/support/requests/${request.id}/messages`);
                        return buildComment(request, msgRes.data || []);
                    })
                );

                if (!cancelled) {
                    setComments(questionItems);
                    wsService.connect(() => {
                        questionRequests.forEach((request) => subscribeRequest(request.id));
                    });
                }
            } catch (error) {
                console.error("Không thể tải hỏi đáp bài học:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadQuestions();

        return () => {
            cancelled = true;
            subscribedRequestsRef.current.forEach((requestId) => {
                wsService.unsubscribe(`/topic/support/request/${requestId}`);
            });
            subscribedRequestsRef.current.clear();
        };
    }, [appendMessage, isLoggedIn, lessonId, subscribeRequest, user]);

    const handleSubmit = async () => {
        const trimmedValue = value.trim();
        if (!trimmedValue || !user) return;

        setSubmitting(true);
        setSubmitError("");
        let senderId;

        try {
            senderId = await getCurrentUserId();
            if (!senderId) {
                throw new Error("Missing current user id");
            }

            const payload = {
                senderId,
                requestId: null,
                type: "ACADEMIC",
                subjectId,
                lessonId,
                title: `Câu hỏi bài học: ${lessonName || lessonId}`,
                content: trimmedValue,
            };

            let res;
            try {
                res = await api.post("/api/support/messages", payload);
            } catch (error) {
                if (error.response?.status !== 404 && error.response?.status !== 405) {
                    throw error;
                }
                res = await api.post("/api/support/test-send", payload);
            }

            const savedMessage = {
                ...res.data,
                lessonId: res.data?.lessonId ?? lessonId,
                lessonName: res.data?.lessonName ?? lessonName,
                subjectId: res.data?.subjectId ?? subjectId,
                senderName: res.data?.senderName ?? user.userName ?? "Học sinh",
                senderRole: res.data?.senderRole ?? user.role ?? "student",
                content: res.data?.content ?? trimmedValue,
                createdAt: res.data?.createdAt ?? new Date().toISOString(),
            };

            appendMessage(savedMessage);
            subscribeRequest(savedMessage.requestId);
            setValue("");
        } catch (error) {
            console.error("Không thể gửi câu hỏi:", error);
            setSubmitError("Không thể gửi câu hỏi. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplySubmit = async (item) => {
        const trimmedValue = replyValue.trim();
        if (!trimmedValue || !user || !item?.requestId) return;

        setReplySubmitting(true);
        setReplyError("");
        let senderId;

        try {
            senderId = await getCurrentUserId();
            if (!senderId) {
                throw new Error("Missing current user id");
            }

            const payload = {
                senderId,
                requestId: item.requestId,
                type: "ACADEMIC",
                subjectId,
                lessonId,
                content: trimmedValue,
            };

            let res;
            try {
                res = await api.post("/api/support/messages", payload);
            } catch (error) {
                if (error.response?.status !== 404 && error.response?.status !== 405) {
                    throw error;
                }
                res = await api.post("/api/support/test-send", payload);
            }

            const savedMessage = {
                ...res.data,
                requestId: res.data?.requestId ?? item.requestId,
                lessonId: res.data?.lessonId ?? lessonId,
                lessonName: res.data?.lessonName ?? lessonName,
                subjectId: res.data?.subjectId ?? subjectId,
                senderId: res.data?.senderId ?? senderId,
                senderName: res.data?.senderName ?? user.userName ?? "Học sinh",
                senderRole: res.data?.senderRole ?? user.role ?? "student",
                content: res.data?.content ?? trimmedValue,
                createdAt: res.data?.createdAt ?? new Date().toISOString(),
            };

            appendMessage(savedMessage);
            subscribeRequest(savedMessage.requestId);
            setReplyingTo(null);
            setReplyValue("");
        } catch (error) {
            console.error("Không thể gửi bình luận:", error);
            setReplyError("Không thể gửi bình luận. Vui lòng thử lại.");
        } finally {
            setReplySubmitting(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex h-full items-center justify-center px-4 text-sm text-muted-foreground">
                Vui lòng đăng nhập để đặt câu hỏi cho giáo viên.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6 p-4">
            <div className="space-y-4">
                <Textarea
                    rows={3}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setSubmitError("");
                    }}
                    value={value}
                    placeholder="Đặt câu hỏi của bạn tại đây..."
                    className="resize-none"
                />
                {submitError && (
                    <p className="text-sm font-medium text-red-600" role="alert">
                        {submitError}
                    </p>
                )}
                <Button onClick={handleSubmit} disabled={submitting || !value.trim()}>
                    {submitting ? "Đang gửi..." : "Gửi câu hỏi"}
                </Button>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b">
                <h4 className="font-semibold text-lg">Hỏi đáp ({comments.length})</h4>
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Đang tải hỏi đáp...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Chưa có câu hỏi nào cho bài học này.
                        </p>
                    ) : (
                        comments.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={item.avatar} />
                                    <AvatarFallback>{item.author?.[0] || "H"}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h5 className="font-semibold text-sm">{item.author}</h5>
                                        <span className="text-xs text-muted-foreground">
                                            {item.datetime}
                                        </span>
                                    </div>

                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{item.content}</p>

                                    {item.replies.length > 0 && (
                                        <div className="mt-3 pl-4 border-l-2 border-muted space-y-4">
                                            {item.replies.map((reply) => {
                                                const isTeacherReply = isTeacherMessage(reply);
                                                const isCurrentUserReply = Number(reply.senderId) === Number(user?.id);

                                                return (
                                                    <div key={reply.id} className="flex gap-3">
                                                        <Avatar className={`h-8 w-8 ${isTeacherReply ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                                                            <AvatarFallback>
                                                                {isTeacherReply ? "GV" : isCurrentUserReply ? "B" : reply.author?.[0] || "H"}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h6 className={`font-semibold text-xs ${isTeacherReply ? "text-primary" : "text-blue-700"}`}>
                                                                    {isCurrentUserReply ? "Bạn" : reply.author}
                                                                </h6>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {reply.datetime}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm mt-0.5 whitespace-pre-wrap">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="pt-3">
                                        {replyingTo === item.requestId ? (
                                            <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                                                <Textarea
                                                    rows={2}
                                                    value={replyValue}
                                                    onChange={(e) => {
                                                        setReplyValue(e.target.value);
                                                        setReplyError("");
                                                    }}
                                                    placeholder="Viết bình luận thêm..."
                                                    className="resize-none bg-white"
                                                />
                                                {replyError && (
                                                    <p className="text-sm font-medium text-red-600" role="alert">
                                                        {replyError}
                                                    </p>
                                                )}
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyValue("");
                                                            setReplyError("");
                                                        }}
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Hủy
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleReplySubmit(item)}
                                                        disabled={replySubmitting || !replyValue.trim()}
                                                    >
                                                        <Send className="mr-2 h-4 w-4" />
                                                        {replySubmitting ? "Đang gửi..." : "Gửi bình luận"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                onClick={() => {
                                                    setReplyingTo(item.requestId);
                                                    setReplyValue("");
                                                    setReplyError("");
                                                }}
                                            >
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                Bình luận thêm
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default QnATab;
