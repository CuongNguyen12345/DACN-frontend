import { Carousel, Card, Tag, Typography, Button } from "antd";
import { PlayCircleOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            type: "lesson",
            subject: "Toán 12",
            title: "Nguyên hàm & Tích phân",
            progress: 50,
            status: "Đang học",
            color: "#1890ff",
        },
        {
            id: 2,
            type: "exam",
            subject: "Hóa học",
            title: "Thi thử tháng 10",
            score: 8.5,
            status: "Đã làm",
            color: "#ffc107",
        },
        {
            id: 3,
            type: "lesson",
            subject: "Vật lý 12",
            title: "Dao động cơ",
            progress: 10,
            status: "Mới bắt đầu",
            color: "#52c41a",
        },
        {
            id: 4,
            type: "exam",
            subject: "Sinh học",
            title: "Kiểm tra 1 tiết",
            score: 9.0,
            status: "Đã làm",
            color: "#ff4d4f",
        },
    ];

    return (
        <div className="recent-activity">
            <Title level={4} style={{ marginBottom: "16px" }}>
                Lịch sử học tập gần đây
            </Title>
            <Carousel slidesToShow={3} infinite={false} gutter={16} arrows dots={false} responsive={[
                { breakpoint: 768, settings: { slidesToShow: 1 } },
                { breakpoint: 1024, settings: { slidesToShow: 2 } }
            ]}>
                {activities.map((item) => (
                    <div key={item.id} style={{ padding: "0 8px" }}>
                        <Card
                            hoverable
                            bodyStyle={{ padding: "16px" }}
                            style={{ margin: "0 8px", borderRadius: "12px", borderTop: `4px solid ${item.color}` }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <Tag color={item.color}>{item.subject}</Tag>
                                <Text type="secondary" style={{ fontSize: "12px" }}>{item.status}</Text>
                            </div>
                            <Title level={5} ellipsis={{ rows: 1 }} style={{ marginBottom: "8px" }}>
                                {item.title}
                            </Title>

                            {item.type === "lesson" ? (
                                <div>
                                    <Text type="secondary" style={{ fontSize: "12px" }}>Tiến độ: {item.progress}%</Text>
                                    <div style={{ height: "4px", background: "#f0f0f0", borderRadius: "2px", marginTop: "4px" }}>
                                        <div style={{ width: `${item.progress}%`, background: item.color, height: "100%", borderRadius: "2px" }}></div>
                                    </div>
                                    <Button type="link" icon={<PlayCircleOutlined />} style={{ padding: 0, marginTop: "8px" }}>
                                        Tiếp tục học
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Text strong style={{ color: item.color }}>Điểm: {item.score}</Text>
                                    <br />
                                    <Button type="link" icon={<EyeOutlined />} style={{ padding: 0, marginTop: "8px" }}>
                                        Xem lại
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default RecentActivity;
