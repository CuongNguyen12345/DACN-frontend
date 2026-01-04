import { Card, List, Checkbox, Typography, Tag } from "antd";

const { Title } = Typography;

const TodayTasks = () => {
    const tasks = [
        { id: 1, title: "Hoàn thành bài tập Nguyên hàm", subject: "Toán", completed: false },
        { id: 2, title: "Xem video bài giảng Dao động", subject: "Lý", completed: true },
        { id: 3, title: "Làm đề thi thử Hóa chương 1", subject: "Hóa", completed: false },
        { id: 4, title: "Ôn tập từ vựng Unit 3", subject: "Tiếng Anh", completed: false },
    ];

    return (
        <Card className="today-tasks" title="Nhiệm vụ hôm nay" bordered={false} style={{ height: "100%", borderRadius: "12px" }}>
            <List
                dataSource={tasks}
                renderItem={(item) => (
                    <List.Item>
                        <Checkbox checked={item.completed} style={{ width: "100%" }}>
                            <span style={{ textDecoration: item.completed ? "line-through" : "none", color: item.completed ? "#999" : "inherit" }}>
                                {item.title}
                            </span>
                        </Checkbox>
                        <Tag color={item.completed ? "default" : "blue"}>{item.subject}</Tag>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TodayTasks;
