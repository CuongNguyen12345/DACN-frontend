import { useState } from "react";
import { Input, Button, List, Typography, message } from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

const NoteTab = ({ lessonId }) => {
    const [note, setNote] = useState("");
    const [savedNotes, setSavedNotes] = useState([
        { id: 1, content: "Đoạn 05:30: Công thức tính nhanh đạo hàm.", time: "05:30" }
    ]);

    const handleSave = () => {
        if (!note.trim()) return;
        const newNote = {
            id: Date.now(),
            content: note,
            time: "Now" // Mock timestamp relative to video
        };
        setSavedNotes([...savedNotes, newNote]);
        setNote("");
        message.success("Đã lưu ghi chú!");
    };

    const handleDelete = (id) => {
        setSavedNotes(savedNotes.filter(n => n.id !== id));
    };

    return (
        <div className="note-tab">
            <div style={{ marginBottom: "16px" }}>
                <TextArea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú lại những ý quan trọng..."
                />
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    style={{ marginTop: "8px" }}
                    onClick={handleSave}
                >
                    Lưu Note
                </Button>
            </div>

            <Title level={5}>Ghi chú đã lưu</Title>
            <List
                dataSource={savedNotes}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(item.id)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            title={<Tag color="blue">{item.time}</Tag>}
                            description={<Text>{item.content}</Text>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};
import { Tag } from "antd"; // Missing import added manually
export default NoteTab;
