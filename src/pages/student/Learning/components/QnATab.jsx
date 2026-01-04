import { useState } from "react";

import { Avatar, Form, Button, Input, List, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Since Comment is deprecated in Antd 5, we might need a custom one or just use List.Meta
// For simplicity, using a List with custom styling to mimic comments.

const { TextArea } = Input;

const QnATab = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Nguyễn Văn A",
            avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            content: "Thầy ơi cho em hỏi đoạn 12:30 tại sao lại ra kết quả đó ạ?",
            datetime: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            replies: [
                {
                    id: 11,
                    author: "Giáo viên",
                    avatar: null, // Default
                    content: "Chào em, ở đoạn đó thầy đã áp dụng công thức (a+b)^2 nhé.",
                    datetime: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
                }
            ]
        }
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        if (!value) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setValue("");
            setComments([
                ...comments,
                {
                    id: Date.now(),
                    author: "Bạn (Học sinh)",
                    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                    content: value,
                    datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    replies: []
                },
            ]);
        }, 500);
    };

    return (
        <div className="qna-tab">
            <div style={{ marginBottom: "24px" }}>
                <Form.Item>
                    <TextArea rows={4} onChange={(e) => setValue(e.target.value)} value={value} placeholder="Đặt câu hỏi của bạn tại đây..." />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                        Gửi câu hỏi
                    </Button>
                </Form.Item>
            </div>

            <List
                className="comment-list"
                header={`${comments.length} Câu hỏi`}
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={(item) => (
                    <li>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                            <Avatar src={item.avatar} icon={<UserOutlined />} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <strong>{item.author}</strong>
                                    <span style={{ color: "#999", fontSize: "12px" }}>{item.datetime}</span>
                                </div>
                                <p style={{ margin: "4px 0" }}>{item.content}</p>

                                {/* Replies */}
                                {item.replies.length > 0 && (
                                    <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginTop: "8px" }}>
                                        {item.replies.map(reply => (
                                            <div key={reply.id} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                                <Avatar size="small" style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                                                <div>
                                                    <strong>{reply.author}</strong>
                                                    <p style={{ margin: 0 }}>{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                )}
            />
        </div>
    );
};

export default QnATab;
