import { Card, List, Avatar, Tag, Typography } from "antd";
import { TrophyOutlined, StarFilled, ThunderboltFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

const Achievements = () => {
    const badges = [
        {
            id: 1,
            name: "Thần đồng Toán học",
            icon: <TrophyOutlined style={{ color: "#fadb14" }} />,
            desc: "Giải đúng 1000 câu Toán",
            date: "20/12/2025",
            color: "#fffbe6", // Gold light
            iconColor: "#faad14"
        },
        {
            id: 2,
            name: "Chiến binh Bền bỉ",
            icon: <ThunderboltFilled />,
            desc: "Học liên tục 30 ngày",
            date: "15/12/2025",
            color: "#e6f7ff",
            iconColor: "#1890ff"
        },
        {
            id: 3,
            name: "Master Hình học",
            icon: <StarFilled />,
            desc: "Đạt điểm 10 chuyên đề Hình học",
            date: "10/11/2025",
            color: "#f9f0ff",
            iconColor: "#722ed1"
        }
    ];

    return (
        <Card title="Bảng thành tích" bordered={false} style={{ height: "100%", borderRadius: "12px" }}>
            <List
                itemLayout="horizontal"
                dataSource={badges}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    size={48}
                                    style={{ background: item.color, color: item.iconColor }}
                                    icon={item.icon}
                                />
                            }
                            title={<Text strong>{item.name}</Text>}
                            description={item.desc}
                        />
                        <Tag color="default">{item.date}</Tag>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default Achievements;
