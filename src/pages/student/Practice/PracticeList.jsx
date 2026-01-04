import { useState } from "react";
import {
    Row,
    Col,
    Card,
    Select,
    Typography,
    Tag,
    Button,
    Input,
    Space,
    Divider,
    Pagination
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    ClockCircleOutlined,
    QuestionCircleOutlined,
    UserOutlined,
    PlayCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const PracticeList = () => {
    const navigate = useNavigate();

    // Mock Exam Data
    const exams = [
        {
            id: 1,
            title: "Đề thi thử THPT QG 2025 - Môn Toán (Lần 1)",
            subject: "Toán",
            grade: 12,
            type: "Thi thử THPT QG",
            difficulty: "Vận dụng cao",
            questions: 50,
            time: 90, // minutes
            users: 1542,
            tags: ["Đại số", "Hình học"]
        },
        {
            id: 2,
            title: "Kiểm tra 1 tiết - Hàm số mũ & Logarit",
            subject: "Toán",
            grade: 12,
            type: "1 tiết",
            difficulty: "Vận dụng",
            questions: 25,
            time: 45,
            users: 850,
            tags: ["Chương 2"]
        },
        {
            id: 3,
            title: "Đề ôn tập Vật lý 11 - Chương Điện tích",
            subject: "Lý",
            grade: 11,
            type: "Chuyên đề",
            difficulty: "Cơ bản",
            questions: 20,
            time: 30,
            users: 530,
            tags: ["Điện học"]
        },
        {
            id: 4,
            title: "Đề thi Hóa học 10 - Giữa học kỳ 1",
            subject: "Hóa",
            grade: 10,
            type: "Thi học kỳ",
            difficulty: "Vận dụng",
            questions: 40,
            time: 60,
            users: 1020,
            tags: ["Cấu tạo nguyên tử"]
        },
    ];

    // Colors for difficulty
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case "Cơ bản": return "green";
            case "Vận dụng": return "orange";
            case "Vận dụng cao": return "red";
            default: return "blue";
        }
    };

    const handleStartExam = (id) => {
        navigate(`/practice/room/${id}`);
    };

    return (
        <div style={{ padding: "24px 50px", background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header Section */}
                <div style={{ marginBottom: "24px", textAlign: "center" }}>
                    <Title level={2} style={{ color: "#1890ff" }}>Thư viện Đề thi & Kiểm tra</Title>
                    <Text type="secondary" style={{ fontSize: "16px" }}>
                        Hàng ngàn đề thi chất lượng được cập nhật liên tục giúp bạn chinh phục kỳ thi.
                    </Text>
                </div>

                {/* Filter Section */}
                <Card style={{ marginBottom: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={6}>
                            <Input size="large" placeholder="Tìm kiếm đề thi..." prefix={<SearchOutlined />} />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select placeholder="Môn học" style={{ width: "100%" }} size="large" allowClear>
                                <Option value="math">Toán</Option>
                                <Option value="physics">Lý</Option>
                                <Option value="chemistry">Hóa</Option>
                                <Option value="english">Tiếng Anh</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={3}>
                            <Select placeholder="Lớp" style={{ width: "100%" }} size="large" allowClear>
                                <Option value="10">Lớp 10</Option>
                                <Option value="11">Lớp 11</Option>
                                <Option value="12">Lớp 12</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={5}>
                            <Select placeholder="Loại đề" style={{ width: "100%" }} size="large" allowClear>
                                <Option value="15m">Kiểm tra 15p</Option>
                                <Option value="45m">1 Tiết</Option>
                                <Option value="semester">Thi Học kỳ</Option>
                                <Option value="mock">Thi thử THPT QG</Option>
                                <Option value="topic">Theo Chuyên đề</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={4}>
                            <Select placeholder="Độ khó" style={{ width: "100%" }} size="large" allowClear>
                                <Option value="basic">Cơ bản</Option>
                                <Option value="advanced">Vận dụng</Option>
                                <Option value="master">Vận dụng cao</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={2}>
                            <Button type="primary" size="large" icon={<FilterOutlined />} block>Lọc</Button>
                        </Col>
                    </Row>
                </Card>

                {/* Exam List */}
                <Row gutter={[24, 24]}>
                    {exams.map((exam) => (
                        <Col xs={24} sm={12} lg={6} key={exam.id}>
                            <Card
                                hoverable
                                style={{ borderRadius: "12px", height: "100%" }}
                                bodyStyle={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                        <Tag color="blue">{exam.subject}</Tag>
                                        <Tag color={getDifficultyColor(exam.difficulty)}>{exam.difficulty}</Tag>
                                    </div>
                                    <Title level={5} style={{ marginBottom: "12px", minHeight: "48px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {exam.title}
                                    </Title>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                                        {exam.tags.map(tag => <Tag key={tag} style={{ marginRight: 0 }}>#{tag}</Tag>)}
                                    </div>
                                    <Space direction="vertical" size="small" style={{ width: "100%", color: "#666" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <ClockCircleOutlined /> Thời gian: {exam.time} phút
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <QuestionCircleOutlined /> Số câu: {exam.questions}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <UserOutlined /> Đã làm: {exam.users}
                                        </span>
                                    </Space>
                                </div>

                                <Divider style={{ margin: "16px 0" }} />

                                <Button
                                    type="primary"
                                    block
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => handleStartExam(exam.id)}
                                >
                                    Làm bài ngay
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Pagination defaultCurrent={1} total={50} />
                </div>
            </div>
        </div>
    );
};

export default PracticeList;
