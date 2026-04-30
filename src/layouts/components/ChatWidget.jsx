import { useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Xin chào! Edu4All có thể giúp gì cho bạn hôm nay?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Thêm tin nhắn của user
        const newMsg = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages((prev) => [...prev, newMsg]);
        setInputValue("");

        // Giả lập bot trả lời
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: "Cảm ơn bạn đã liên hệ. Đội ngũ Edu4All sẽ phản hồi lại bạn sớm nhất có thể!", sender: "bot" }
            ]);
        }, 1000);
    };

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
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-100 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Edu4All Support</h3>
                            <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ bạn</p>
                        </div>
                    </div>

                    {/* Khung chat */}
                    <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-blue-100 text-blue-600" : "bg-blue-600 text-white"}`}>
                                    {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border text-gray-800 rounded-tl-sm shadow-sm"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
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
