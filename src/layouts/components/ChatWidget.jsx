import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { wsService } from "@/services/websocket";
import api from "@/services/api";

export const ChatWidget = () => {
    const { user, isLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [requestId, setRequestId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Connect to WebSocket and load existing history when user opens chat
    useEffect(() => {
        if (!isOpen || !isLoggedIn || !user) return;

        const initChat = async () => {
            try {
                // 1. Get existing SYSTEM request for this user
                const reqRes = await api.get(`/api/support/requests/user/${user.id}?type=SYSTEM`);
                let currentRequestId = null;

                if (reqRes.data && reqRes.data.length > 0) {
                    currentRequestId = reqRes.data[0].id;
                    setRequestId(currentRequestId);
                    
                    // Fetch message history
                    const msgRes = await api.get(`/api/support/requests/${currentRequestId}/messages`);
                    if (msgRes.data) {
                        setMessages(msgRes.data);
                    }
                } else {
                    setMessages([
                        { id: 'welcome', content: "Xin chào! Bạn có góp ý hay gặp sự cố gì với hệ thống? Hãy để lại lời nhắn, Admin sẽ kiểm tra và khắc phục sớm nhất nhé.", senderRole: "admin" }
                    ]);
                }

                // 2. Connect to WebSocket
                wsService.connect(() => {
                    // Subscribe to the specific request channel if exists
                    if (currentRequestId) {
                        wsService.subscribe(`/topic/support/request/${currentRequestId}`, (newMessage) => {
                            setMessages((prev) => prev.find(m => m.id === newMessage.id) ? prev : [...prev, newMessage]);
                        });
                    } else {
                        // Subscribe to user queue for the first response if ticket is created dynamically
                        wsService.subscribe(`/topic/support/user/${user.id}`, (newMessage) => {
                            setMessages((prev) => prev.find(m => m.id === newMessage.id) ? prev : [...prev, newMessage]);
                            if (!currentRequestId && newMessage.requestId) {
                                setRequestId(newMessage.requestId);
                                wsService.subscribe(`/topic/support/request/${newMessage.requestId}`, (msg) => {
                                    setMessages((p) => p.find(m => m.id === msg.id) ? p : [...p, msg]);
                                });
                            }
                        });
                    }
                });

            } catch (error) {
                console.error("Error init chat", error);
            }
        };

        initChat();

        return () => {
            // Unsubscribe when chat is closed
            if (requestId) {
                wsService.unsubscribe(`/topic/support/request/${requestId}`);
            }
            wsService.unsubscribe(`/topic/support/user/${user.id}`);
        };
    }, [isOpen, isLoggedIn, user, requestId]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !user) return;

        const payload = {
            senderId: user.id,
            requestId: requestId, // null if this is the first message
            type: "SYSTEM",
            title: "Góp ý & Báo lỗi từ " + user.userName,
            content: inputValue
        };

        wsService.sendMessage("/app/chat.send", payload);
        setInputValue("");
    };

    if (!isLoggedIn) return null;

    return (
        <>
            {/* Nút Chat nổi */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button 
                    onClick={toggleChat}
                    className="w-14 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                </Button>
            </div>

            {/* Cửa sổ Chat */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-100 animate-in slide-in-from-bottom-5 h-[500px] max-h-[calc(100vh-120px)]">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Góp ý & Báo lỗi</h3>
                            <p className="text-xs text-blue-100">Gửi trực tiếp đến Admin</p>
                        </div>
                    </div>

                    {/* Khung chat */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg) => {
                            const isUser = msg.senderId === user.id || msg.senderRole === "student";
                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex gap-2 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-blue-100 text-blue-600" : "bg-blue-600 text-white"}`}>
                                        {isUser ? <User className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${isUser ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border text-gray-800 rounded-tl-sm shadow-sm"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Khu vực nhập tin nhắn */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full text-sm outline-none transition-all"
                        />
                        <Button 
                            type="submit" 
                            disabled={!inputValue.trim()}
                            className="w-10 h-10 rounded-full p-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 disabled:text-gray-400"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            )}
        </>
    );
};
