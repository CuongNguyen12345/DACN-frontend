import { Typography, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const DashboardBanner = () => {
    // Mock Exam Date: June 27, 2026
    const examDate = dayjs("2026-06-27");
    const today = dayjs();
    const daysLeft = examDate.diff(today, "day");

    return (
        <div className="dashboard-banner">
            <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={14}>
                    <div className="banner-welcome">
                        <Title level={2} style={{ color: "#fff", marginBottom: "8px" }}>
                            Chào Nam, hôm nay học Toán nhé?
                        </Title>
                        <Paragraph style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px" }}>
                            Tiếp tục hành trình chinh phục tri thức!
                        </Paragraph>
                    </div>
                </Col>
                <Col xs={24} md={10}>
                    <Card className="banner-countdown" bordered={false}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <ClockCircleOutlined style={{ fontSize: "32px", color: "#faad14" }} />
                            <div>
                                <Text strong style={{ display: "block", fontSize: "16px", color: "#333" }}>
                                    Đếm ngược THPT QG
                                </Text>
                                <Title level={3} style={{ margin: "4px 0", color: "#1890ff" }}>
                                    Còn {daysLeft} Ngày
                                </Title>
                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                    "Không có áp lực, không có kim cương."
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardBanner;
