import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";

const initialComments = [
    {
        id: 1,
        author: "Nguyễn Văn A",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        content: "Thầy ơi cho em hỏi đoạn 12:30 tại sao lại ra kết quả đó ạ?",
        datetime: dayjs().subtract(1, "hour").format("YYYY-MM-DD HH:mm"),
        replies: [
            {
                id: 11,
                author: "Giáo viên",
                avatar: null,
                content: "Chào em, ở đoạn đó thầy đã áp dụng công thức (a+b)^2 nhé.",
                datetime: dayjs().subtract(30, "minute").format("YYYY-MM-DD HH:mm"),
            },
        ],
    },
];

const QnATab = ({ lessonId }) => {
    const [comments, setComments] = useState(initialComments);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        const trimmedValue = value.trim();
        if (!trimmedValue) return;

        setSubmitting(true);

        setTimeout(() => {
            const newComment = {
                id: Date.now(),
                author: "Bạn (Học sinh)",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
                content: trimmedValue,
                datetime: dayjs().format("YYYY-MM-DD HH:mm"),
                lessonId,
                replies: [],
            };

            setComments((prev) => [...prev, newComment]);
            setValue("");
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className="flex flex-col h-full space-y-6 p-4">
            <div className="space-y-4">
                <Textarea
                    rows={3}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    placeholder="Đặt câu hỏi của bạn tại đây..."
                    className="resize-none"
                />
                <Button onClick={handleSubmit} disabled={submitting || !value.trim()}>
                    {submitting ? "Đang gửi..." : "Gửi câu hỏi"}
                </Button>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b">
                <h4 className="font-semibold text-lg">Hỏi đáp ({comments.length})</h4>
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {comments.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={item.avatar} />
                                <AvatarFallback>{item.author[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-semibold text-sm">{item.author}</h5>
                                    <span className="text-xs text-muted-foreground">
                                        {item.datetime}
                                    </span>
                                </div>

                                <p className="text-sm text-foreground/90">{item.content}</p>

                                {item.replies.length > 0 && (
                                    <div className="mt-3 pl-4 border-l-2 border-muted space-y-4">
                                        {item.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-3">
                                                <Avatar className="h-8 w-8 bg-green-100 text-green-600">
                                                    <AvatarFallback>GV</AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h6 className="font-semibold text-xs text-primary">
                                                            {reply.author}
                                                        </h6>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {reply.datetime}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mt-0.5">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default QnATab;