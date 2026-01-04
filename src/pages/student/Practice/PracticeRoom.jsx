import { useState, useEffect } from "react";
import {
    Typography,
    Button,
    Radio,
    Space,
    Card,
    Row,
    Col,
    Statistic,
    Modal,
    Layout,
    Affix,
    Tag
} from "antd";
import {
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    FlagOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Sider } = Layout;
const { Countdown } = Statistic;

const PracticeRoom = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({}); // { 1: 'A', 2: 'B' }
    const [deadline, setDeadline] = useState(Date.now() + 90 * 60 * 1000); // 90 mins from now

    // Mock Questions
    const questions = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        content: `Câu hỏi số ${i + 1}: Tìm tập xác định của hàm số y = (x - 2)^(-3)?`,
        options: [
            { key: "A", text: "R \\ {2}" },
            { key: "B", text: "R" },
            { key: "C", text: "(2; +∞)" },
            { key: "D", text: "(-∞; 2)" }
        ]
    }));

    const handleAnswerSelect = (questionId, optionKey) => {
        setAnswers({ ...answers, [questionId]: optionKey });
    };

    const calculateUnanswered = () => {
        return questions.length - Object.keys(answers).length;
    };

    const handleSubmit = () => {
        const unanswered = calculateUnanswered();
        Modal.confirm({
            title: 'Bạn chắc chắn muốn nộp bài?',
            icon: <ExclamationCircleOutlined />,
            content: unanswered > 0
                ? `Bạn còn ${unanswered} câu chưa làm. Bạn có chắc chắn muốn kết thúc bài thi?`
                : 'Bạn đã hoàn thành tất cả câu hỏi.',
            okText: 'Nộp bài',
            cancelText: 'Làm tiếp',
            onOk: () => {
                // Navigate to result
                navigate("/practice/result/1");
            }
        });
    };

    const handleFinish = () => {
        Modal.info({
            title: "Hết giờ!",
            content: "Hệ thống sẽ tự động nộp bài làm của bạn.",
            onOk: () => navigate("/practice/result/1")
        });
    };

    const scrollToQuestion = (id) => {
        const element = document.getElementById(`question-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Exam Header */}
            <Header style={{
                background: "#fff",
                padding: "0 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 100
            }}>
                <Title level={4} style={{ margin: 0 }}>Đề thi thử THPT QG 2025 - Môn Toán</Title>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fef0ef", padding: "4px 16px", borderRadius: "20px", border: "1px solid #ffa39e" }}>
                        <ClockCircleOutlined style={{ color: "#f5222d" }} />
                        <Countdown
                            value={deadline}
                            onFinish={handleFinish}
                            format="mm:ss"
                            valueStyle={{ color: "#f5222d", fontSize: "18px", fontWeight: "bold" }}
                        />
                    </div>
                    <Button type="primary" size="large" onClick={handleSubmit}>Nộp bài</Button>
                </div>
            </Header>

            <Layout>
                {/* Question Content (Left/Center) */}
                <Content style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
                    {questions.map((q) => (
                        <Card
                            key={q.id}
                            id={`question-${q.id}`}
                            style={{ marginBottom: "20px", borderRadius: "12px", border: "1px solid #f0f0f0" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                <Tag color="blue" style={{ fontSize: "14px", padding: "4px 10px" }}>Câu {q.id}</Tag>
                                <Button type="text" icon={<FlagOutlined />} size="small">Báo lỗi</Button>
                            </div>
                            <Paragraph style={{ fontSize: "16px", fontWeight: 500 }}>{q.content}</Paragraph>
                            <Radio.Group
                                onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                                value={answers[q.id]}
                                style={{ width: "100%" }}
                            >
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    {q.options.map(opt => (
                                        <Radio
                                            key={opt.key}
                                            value={opt.key}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "12px",
                                                borderRadius: "8px",
                                                border: answers[q.id] === opt.key ? "1px solid #1890ff" : "1px solid #d9d9d9",
                                                background: answers[q.id] === opt.key ? "#e6f7ff" : "transparent",
                                                width: "100%"
                                            }}
                                        >
                                            <span style={{ fontWeight: "bold", marginRight: "8px" }}>{opt.key}.</span> {opt.text}
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                        </Card>
                    ))}
                </Content>

                {/* Question Palette (Right Sider) */}
                <Sider width={320} theme="light" style={{ padding: "24px", borderLeft: "1px solid #f0f0f0", height: "calc(100vh - 64px)", position: "sticky", top: 64, overflowY: "auto" }}>
                    <Title level={5} style={{ marginBottom: "16px" }}>Danh sách câu hỏi</Title>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                        {questions.map(q => (
                            <Button
                                key={q.id}
                                type={answers[q.id] ? "primary" : "default"}
                                shape="default"
                                style={{
                                    width: "100%",
                                    background: answers[q.id] ? undefined : "#f5f5f5",
                                    border: answers[q.id] ? undefined : "none"
                                }}
                                onClick={() => scrollToQuestion(q.id)}
                            >
                                {q.id}
                            </Button>
                        ))}
                    </div>
                    <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f0f0f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <div style={{ width: "20px", height: "20px", background: "#1890ff", borderRadius: "4px" }}></div>
                            <Text>Đã làm</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "20px", height: "20px", background: "#f5f5f5", borderRadius: "4px", border: "1px solid #d9d9d9" }}></div>
                            <Text>Chưa làm</Text>
                        </div>
                    </div>
                </Sider>
            </Layout>
        </Layout>
    );
};

export default PracticeRoom;
