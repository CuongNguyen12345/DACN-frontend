import { Typography, Row, Col, Card, Avatar, Statistic, Button, Tag, Divider } from "antd";
import { UserOutlined, FireOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import RadarChart from "./components/RadarChart";
import Achievements from "./components/Achievements";
import Goals from "./components/Goals";

const { Title, Text } = Typography;

const Profile = () => {
    // Mock Data
    const user = {
        name: "Nguyễn Văn Nam",
        grade: "Lớp 12A1",
        avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        streak: 15,
        totalTime: "124h",
        exercises: 450
    };

    const radarData = [
        { subject: "Toán", value: 85 },
        { subject: "Lý", value: 70 },
        { subject: "Hóa", value: 60 },
        { subject: "Sinh", value: 50 },
        { subject: "Anh", value: 75 },
        { subject: "Văn", value: 65 }
    ];

    return (
        <div style={{ padding: "40px 24px", background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                {/* Header Section */}
                <Card style={{ borderRadius: "16px", marginBottom: "24px", backgroundImage: "linear-gradient(to right, #ffffff, #f0f2f5)" }}>
                    <Row align="middle" gutter={24}>
                        <Col>
                            <Avatar size={100} src={user.avatar} icon={<UserOutlined />} style={{ border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                        </Col>
                        <Col flex={1}>
                            <Title level={2} style={{ marginBottom: "0" }}>{user.name}</Title>
                            <Text type="secondary" style={{ fontSize: "16px" }}>{user.grade}</Text>
                            <div style={{ marginTop: "12px" }}>
                                <Tag icon={<FireOutlined />} color="#f50">Streak: {user.streak} ngày</Tag>
                                <Tag icon={<ClockCircleOutlined />} color="blue">Đã học: {user.totalTime}</Tag>
                            </div>
                        </Col>
                        <Col>
                            <Button type="primary" size="large">Chỉnh sửa hồ sơ</Button>
                        </Col>
                    </Row>
                </Card>

                {/* Overview Section */}
                <Row gutter={[24, 24]}>
                    {/* Left Column: Radar & Stats */}
                    <Col xs={24} lg={16}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Card title="Năng lực học tập" bordered={false} style={{ borderRadius: "12px", height: "100%" }}>
                                    <RadarChart data={radarData} />
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Goals />
                            </Col>
                        </Row>

                        <div style={{ marginTop: "24px" }}>
                            <Achievements />
                        </div>
                    </Col>

                    {/* Right Column: Statistics Grid */}
                    <Col xs={24} lg={8}>
                        <Card title="Thống kê tổng quan" bordered={false} style={{ borderRadius: "12px", height: "100%" }}>
                            <Row gutter={[16, 24]}>
                                <Col span={12}>
                                    <Statistic
                                        title="Bài tập đã làm"
                                        value={user.exercises}
                                        prefix={<BookOutlined style={{ color: "#1890ff" }} />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Giờ học tuần này"
                                        value={12.5}
                                        precision={1}
                                        suffix="h"
                                        prefix={<ClockCircleOutlined style={{ color: "#52c41a" }} />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Điểm trung bình"
                                        value={8.2}
                                        precision={1}
                                        prefix={<UserOutlined style={{ color: "#faad14" }} />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Xếp hạng lớp"
                                        value={5}
                                        prefix={<TrophyOutlined style={{ color: "#eb2f96" }} />}
                                    />
                                </Col>
                            </Row>
                            <Divider />
                            <div style={{ textAlign: "center" }}>
                                <Text type="secondary">Cố gắng duy trì phong độ nhé!</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

import { TrophyOutlined } from "@ant-design/icons"; // Added missing import
export default Profile;
