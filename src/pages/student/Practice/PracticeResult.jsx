import { Typography, Card, Row, Col, Progress, Button, List, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ArrowRightOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const PracticeResult = () => {
    const navigate = useNavigate();
    // Mock Result Data
    const result = {
        score: 8.4,
        correct: 42,
        total: 50,
        timeTaken: "85:12",
        analysis: [
            { topic: "Hàm số", correct: 18, total: 20, percent: 90 },
            { topic: "Mũ & Logarit", correct: 10, total: 10, percent: 100 },
            { topic: "Nguyên hàm", correct: 8, total: 12, percent: 66 },
            { topic: "Hình học không gian", correct: 6, total: 8, percent: 75 }
        ]
    };

    return (
        <div style={{ padding: "40px 24px", background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                {/* Score Card */}
                <Card style={{ borderRadius: "16px", textAlign: "center", marginBottom: "24px" }}>
                    <Title level={4} type="secondary">Kết quả làm bài</Title>
                    <div style={{ margin: "24px 0" }}>
                        <Progress
                            type="circle"
                            percent={(result.score / 10) * 100}
                            format={() => <span style={{ fontSize: "32px", fontWeight: "bold", color: "#1890ff" }}>{result.score}</span>}
                            width={180}
                            strokeColor="#1890ff"
                        />
                    </div>
                    <Title level={3} style={{ marginBottom: "8px" }}>Khá tốt! Bạn đã hoàn thành bài thi.</Title>
                    <Paragraph>
                        Bạn làm đúng <Text strong type="success">{result.correct}/{result.total}</Text> câu trong thời gian <Text strong>{result.timeTaken}</Text>.
                    </Paragraph>

                    <Row gutter={16} justify="center" style={{ marginTop: "24px" }}>
                        <Col>
                            <Button size="large" icon={<ReloadOutlined />} onClick={() => navigate("/practice")}>Làm bài khác</Button>
                        </Col>
                        <Col>
                            <Button size="large" type="primary" icon={<ArrowRightOutlined />}>Xem chi tiết lời giải</Button>
                        </Col>
                    </Row>
                </Card>

                {/* Analytics Card */}
                <Card title="Phân tích kết quả" style={{ borderRadius: "16px" }}>
                    <List
                        dataSource={result.analysis}
                        renderItem={item => (
                            <List.Item>
                                <div style={{ width: "100%" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <Text strong>{item.topic}</Text>
                                        <Text>
                                            {item.correct}/{item.total} câu ({item.percent}%)
                                        </Text>
                                    </div>
                                    <Progress
                                        percent={item.percent}
                                        status={item.percent >= 80 ? "success" : item.percent >= 50 ? "active" : "exception"}
                                        strokeColor={item.percent >= 80 ? "#52c41a" : item.percent >= 50 ? "#1890ff" : "#ff4d4f"}
                                    />
                                    <div style={{ marginTop: "8px" }}>
                                        {item.percent < 50 && <Tag color="error">Cần ôn tập thêm</Tag>}
                                        {item.percent >= 90 && <Tag color="success">Nắm chắc kiến thức</Tag>}
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default PracticeResult;
