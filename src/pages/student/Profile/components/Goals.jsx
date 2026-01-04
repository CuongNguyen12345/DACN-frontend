import { Card, List, Progress, Button, Typography, Modal, Input, Slider } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons"; //TargetOutlined
import { useState } from "react";

const { Title, Text } = Typography;

const Goals = () => {
    // Mock Goals
    const [goals, setGoals] = useState([
        { id: 1, title: "Mục tiêu thi THPT QG", target: 27, current: 24, unit: "điểm" },
        { id: 2, title: "Mục tiêu IELTS", target: 7.5, current: 6.0, unit: "band" }
    ]);

    return (
        <Card
            title={<span> Mục tiêu học tập</span>}
            extra={<Button type="link" icon={<PlusOutlined />}>Thêm mục tiêu</Button>}
            bordered={false}
            style={{ height: "100%", borderRadius: "12px" }}
        >
            <List
                dataSource={goals}
                renderItem={(item) => {
                    const percent = (item.current / item.target) * 100;
                    return (
                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <Text strong>{item.title}</Text>
                                <Text type="secondary">
                                    {item.current} / {item.target} {item.unit}
                                </Text>
                            </div>
                            <Progress
                                percent={percent}
                                status="active"
                                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                            />
                        </div>
                    )
                }}
            />
        </Card>
    );
};

export default Goals;
