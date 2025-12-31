import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Avatar,
  Tag,
  Statistic,
  Typography
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  BulbOutlined,
} from "@ant-design/icons";

import { TbMathSymbols } from "react-icons/tb";
import { useState } from "react";
const { Title, Paragraph, Text } = Typography;
const Home = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const grades = [
    { id: 10, name: "Khối 10", color: "#1890ff" },
    { id: 11, name: "Khối 11", color: "#FFC107" },
    { id: 12, name: "Khối 12", color: "#1890ff" },
  ];

  const subjects = {
    10: [
      {
        id: 1,
        name: "Toán học",
        icon: <TbMathSymbols />,
        lessons: 45,
        color: "#1890ff",
      },
      {
        id: 2,
        name: "Vật lý",
        icon: <BulbOutlined />,
        lessons: 38,
        color: "#FFC107",
      },
      {
        id: 3,
        name: "Hóa học",
        icon: <FileTextOutlined />,
        lessons: 42,
        color: "#FF6B35",
      },
      {
        id: 4,
        name: "Sinh học",
        icon: <BookOutlined />,
        lessons: 35,
        color: "#4ECDC4",
      },
      {
        id: 5,
        name: "Ngữ văn",
        icon: <FileTextOutlined />,
        lessons: 40,
        color: "#9B59B6",
      },
      {
        id: 6,
        name: "Lịch sử",
        icon: <BookOutlined />,
        lessons: 30,
        color: "#E74C3C",
      },
    ],
    11: [
      {
        id: 1,
        name: "Toán học",
        icon: <TbMathSymbols />,
        lessons: 50,
        color: "#1890ff",
      },
      {
        id: 2,
        name: "Vật lý",
        icon: <BulbOutlined />,
        lessons: 45,
        color: "#FFC107",
      },
      {
        id: 3,
        name: "Hóa học",
        icon: <FileTextOutlined />,
        lessons: 48,
        color: "#FF6B35",
      },
      {
        id: 4,
        name: "Sinh học",
        icon: <BookOutlined />,
        lessons: 40,
        color: "#4ECDC4",
      },
      {
        id: 5,
        name: "Ngữ văn",
        icon: <FileTextOutlined />,
        lessons: 45,
        color: "#9B59B6",
      },
      {
        id: 6,
        name: "Địa lý",
        icon: <BookOutlined />,
        lessons: 35,
        color: "#2ECC71",
      },
    ],
    12: [
      {
        id: 1,
        name: "Toán học",
        icon: <TbMathSymbols />,
        lessons: 60,
        color: "#1890ff",
      },
      {
        id: 2,
        name: "Vật lý",
        icon: <BulbOutlined />,
        lessons: 55,
        color: "#FFC107",
      },
      {
        id: 3,
        name: "Hóa học",
        icon: <FileTextOutlined />,
        lessons: 58,
        color: "#FF6B35",
      },
      {
        id: 4,
        name: "Sinh học",
        icon: <BookOutlined />,
        lessons: 50,
        color: "#4ECDC4",
      },
      {
        id: 5,
        name: "Ngữ văn",
        icon: <FileTextOutlined />,
        lessons: 52,
        color: "#9B59B6",
      },
      {
        id: 6,
        name: "Tiếng Anh",
        icon: <BookOutlined />,
        lessons: 48,
        color: "#F39C12",
      },
    ],
  };

  const stats = [
    {
      title: "Tổng bài học",
      value: 1200,
      icon: <FileTextOutlined />,
      color: "#1890ff",
    },
    {
      title: "Video bài giảng",
      value: 850,
      icon: <VideoCameraOutlined />,
      color: "#FFC107",
    },
    {
      title: "Bài tập",
      value: 2000,
      icon: <CheckCircleOutlined />,
      color: "#1890ff",
    },
    {
      title: "Học sinh",
      value: 5000,
      icon: <UserOutlined />,
      color: "#FFC107",
    },
  ];
  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1890ff 0%, #FFC107 100%)",
          padding: "80px 50px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Title
          level={1}
          style={{ color: "#fff", fontSize: "48px", marginBottom: "16px" }}
        >
          Học tập hiệu quả, Tự tin thi cử
        </Title>
        <Paragraph
          style={{
            color: "#fff",
            fontSize: "20px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Hệ thống học tập tự học toàn diện cho học sinh THPT với đầy đủ tài
          liệu, video bài giảng và bài tập từ khối 10 đến khối 12
        </Paragraph>
      </div>

      {/* Statistics */}
      <div style={{ padding: "40px 50px", background: "#fff" }}>
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={
                    <span style={{ color: stat.color, fontSize: "24px" }}>
                      {stat.icon}
                    </span>
                  }
                  valueStyle={{ color: stat.color, fontWeight: "bold" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Grade Selection */}
      <div style={{ padding: "50px", background: "#f0f2f5" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  border:
                    selectedGrade === grade.id
                      ? `3px solid ${grade.color}`
                      : "1px solid #d9d9d9",
                  transform:
                    selectedGrade === grade.id ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s",
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
                <Title
                  level={3}
                  style={{ margin: "16px 0", color: grade.color }}
                >
                  {grade.name}
                </Title>
                <Text type="secondary">
                  {selectedGrade === grade.id ? "Đã chọn" : "Nhấn để chọn"}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Subjects Display */}
      {selectedGrade && (
        <div style={{ padding: "50px", background: "#fff" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Title level={2}>
              Các môn học - {grades.find((g) => g.id === selectedGrade)?.name}
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              Chọn môn học để bắt đầu học tập
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {subjects[selectedGrade]?.map((subject) => (
              <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderTop: `4px solid ${subject.color}`,
                  }}
                  actions={[
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      style={{ width: "100%", border: "none" }}
                    >
                      Bắt đầu học
                    </Button>,
                  ]}
                >
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <Avatar
                      size={64}
                      style={{
                        background: subject.color,
                        marginBottom: "12px",
                      }}
                      icon={subject.icon}
                    />
                    <Title level={4} style={{ margin: "12px 0 8px 0" }}>
                      {subject.name}
                    </Title>
                    <Space>
                      <Tag icon={<FileTextOutlined />} color={subject.color}>
                        {subject.lessons} bài học
                      </Tag>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Features Section */}
      {!selectedGrade && (
        <div style={{ padding: "50px", background: "#fff" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Title level={2}>Tính năng nổi bật</Title>
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: "center", height: "100%" }}>
                <VideoCameraOutlined
                  style={{
                    fontSize: "48px",
                    color: "#1890ff",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4}>Video bài giảng</Title>
                <Paragraph>
                  Hàng trăm video bài giảng chất lượng cao, dễ hiểu
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: "center", height: "100%" }}>
                <FileTextOutlined
                  style={{
                    fontSize: "48px",
                    color: "#FFC107",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4}>Tài liệu phong phú</Title>
                <Paragraph>
                  Đầy đủ tài liệu, đề thi và bài tập từ cơ bản đến nâng cao
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: "center", height: "100%" }}>
                <ClockCircleOutlined
                  style={{
                    fontSize: "48px",
                    color: "#1890ff",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4}>Học mọi lúc mọi nơi</Title>
                <Paragraph>
                  Học tập linh hoạt theo thời gian và tiến độ của bạn
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: "center", height: "100%" }}>
                <TrophyOutlined
                  style={{
                    fontSize: "48px",
                    color: "#FFC107",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4}>Theo dõi tiến độ</Title>
                <Paragraph>
                  Theo dõi quá trình học tập và thành tích của bạn
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Home;
