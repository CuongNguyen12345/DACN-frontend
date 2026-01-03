import { useState } from "react";
import { Card, Row, Col, Avatar, Typography, Button, Tag } from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { TbMathSymbols } from "react-icons/tb";
import { FaAtom, FaFlask, FaBookOpen } from "react-icons/fa";
import { GiDna1 } from "react-icons/gi";
import { MdTranslate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const { Title, Paragraph, Text } = Typography;
const GradeSelection = () => {
  const navigate = useNavigate();
  const grades = [
    { id: 10, name: "Khối 10", color: "#1890ff" },
    { id: 11, name: "Khối 11", color: "#FFC107" },
    { id: 12, name: "Khối 12", color: "#00F15A" },
  ];
  const subjects = [
    {
      id: 1,
      name: "Toán học",
      icon: <TbMathSymbols />,
      lessons: { 10: 45, 11: 50, 12: 60 },
      color: "#1890ff",
    },
    {
      id: 2,
      name: "Vật lý",
      icon: <FaAtom />,
      lessons: { 10: 38, 11: 45, 12: 55 },
      color: "#FFC107",
    },
    {
      id: 3,
      name: "Hóa học",
      icon: <FaFlask />,
      lessons: { 10: 42, 11: 48, 12: 58 },
      color: "#FF6B35",
    },
    {
      id: 4,
      name: "Sinh học",
      icon: <GiDna1 />,
      lessons: { 10: 35, 11: 40, 12: 50 },
      color: "#4ECDC4",
    },
    {
      id: 5,
      name: "Ngữ văn",
      icon: <FaBookOpen />,
      lessons: { 10: 40, 11: 45, 12: 52 },
      color: "#9B59B6",
    },
    {
      id: 6,
      name: "Tiếng Anh",
      icon: <MdTranslate />,
      lessons: { 10: 45, 11: 48, 12: 55 },
      color: "#F39C12",
    },
  ];
  const handleStartLearning = (subjectId) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa (dựa vào token trong localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/learning/${subjectId}`);
    } else {
      navigate("/login");
    }
  };
  const [selectedGrade, setSelectedGrade] = useState(null);
  return (
    <div className="home-grade">
      <div className="home-grade__header">
        <Title level={2}>Chọn khối lớp của bạn</Title>
        <Paragraph style={{ fontSize: "16px", color: "#666" }}>
          Chọn khối lớp để xem các môn học và bài học có sẵn
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {grades.map((grade) => (
          <Col xs={24} sm={12} md={8} key={grade.id}>
            <Card
              hoverable
              className={`home-grade__card ${
                selectedGrade === grade.id ? "home-grade__card--active" : ""
              }`}
              style={{
                border:
                  selectedGrade === grade.id
                    ? `3px solid ${grade.color}`
                    : "1px solid #d9d9d9",
              }}
              onClick={() => setSelectedGrade(grade.id)}
            >
              <Avatar
                size={80}
                style={{
                  background: grade.color,
                  marginBottom: "16px",
                }}
                icon={<BookOutlined style={{ fontSize: "40px" }} />}
              />
              <Title level={3} style={{ margin: "16px 0", color: grade.color }}>
                {grade.name}
              </Title>
              <Text type="secondary">
                {selectedGrade === grade.id ? "Đã chọn" : "Nhấn để chọn"}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Subjects Display */}
      {selectedGrade && (
        <div className="home-subjects">
          <div className="home-subjects__header">
            <Title level={2}>
              Các môn học - {grades.find((g) => g.id === selectedGrade)?.name}
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              Chọn môn học để bắt đầu học tập
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {subjects.map((subject) => (
              <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
                <Card
                  hoverable
                  className="subject-card"
                  style={{
                    borderTop: `4px solid ${subject.color}`,
                  }}
                  actions={[
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      style={{ width: "100%", border: "none" }}
                      onClick={() => handleStartLearning(subject.id)}
                    >
                      Bắt đầu học
                    </Button>,
                  ]}
                >
                  <div className="subject-card__icon">
                    <Avatar
                      size={64}
                      style={{
                        background: subject.color,
                        marginBottom: "12px",
                      }}
                      icon={subject.icon}
                    />
                    <Title level={4} className="subject-card__title">
                      {subject.name}
                    </Title>
                    <div className="subject-card__tag">
                      <Tag icon={<FileTextOutlined />} color={subject.color}>
                        {subject.lessons[selectedGrade]} bài học
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default GradeSelection;
