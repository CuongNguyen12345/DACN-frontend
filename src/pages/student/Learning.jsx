import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Row, 
  Col, 
  Card, 
  List, 
  Typography, 
  Button, 
  Tabs, 
  Breadcrumb,
  Tag 
} from "antd";
import { 
  PlayCircleOutlined, 
  CheckCircleFilled, 
  ArrowLeftOutlined,
  FileTextOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const Learning = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  // Mock data cho danh sách bài học
  const lessons = [
    {
      id: 1,
      title: "Bài 1: Giới thiệu tổng quan",
      duration: "15:30",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Link demo
      isCompleted: true,
      content: `
        <h3>1. Khái niệm cơ bản</h3>
        <p>Trong bài học này, chúng ta sẽ tìm hiểu về các khái niệm nền tảng...</p>
        <h3>2. Nội dung chính</h3>
        <p>Các định luật bảo toàn và ứng dụng thực tiễn trong đời sống.</p>
        <ul>
          <li>Định luật 1</li>
          <li>Định luật 2</li>
        </ul>
      `
    },
    {
      id: 2,
      title: "Bài 2: Các định luật cơ bản",
      duration: "20:45",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Nội dung lý thuyết bài 2 đang được cập nhật...</p>"
    },
    {
      id: 3,
      title: "Bài 3: Bài tập vận dụng",
      duration: "45:00",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Hướng dẫn giải bài tập chi tiết...</p>"
    },
    {
      id: 4,
      title: "Bài 4: Ôn tập chương 1",
      duration: "30:15",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Tổng hợp kiến thức chương 1...</p>"
    },
    {
      id: 5,
      title: "Bài 5: Kiểm tra 15 phút",
      duration: "15:00",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Đề kiểm tra trắc nghiệm...</p>"
    },
  ];

  const [activeLesson, setActiveLesson] = useState(lessons[0]);

  // Tab items cho phần nội dung bên dưới
  const tabItems = [
    {
      key: '1',
      label: <span><FileTextOutlined /> Lý thuyết</span>,
      children: (
        <div style={{ padding: '20px', background: '#fff', minHeight: '200px' }}>
          <Title level={4}>{activeLesson.title}</Title>
          <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
        </div>
      ),
    },
    {
      key: '2',
      label: <span><QuestionCircleOutlined /> Hỏi đáp</span>,
      children: <div style={{ padding: '20px' }}>Chức năng hỏi đáp đang phát triển...</div>,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Header Navigation */}
      <div style={{ background: "#fff", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <Breadcrumb
          items={[
            { title: <a onClick={() => navigate('/')}><ArrowLeftOutlined /> Trang chủ</a> },
            { title: 'Môn học' },
            { title: activeLesson.title },
          ]}
        />
      </div>

      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {/* Left Column: Video & Theory */}
          <Col xs={24} lg={16}>
            {/* Video Player Section */}
            <Card 
              styles={{ body: { padding: 0 } }}
              style={{ marginBottom: "24px", overflow: "hidden", borderRadius: "12px" }}
            >
              <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}>
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={4} style={{ margin: 0 }}>{activeLesson.title}</Title>
                <Button type="primary">Hoàn thành bài học</Button>
              </div>
            </Card>

            {/* Theory / Content Section (Below Video) */}
            <Card style={{ borderRadius: "12px" }}>
              <Tabs defaultActiveKey="1" items={tabItems} />
            </Card>
          </Col>

          {/* Right Column: Lesson List */}
          <Col xs={24} lg={8}>
            <Card 
              title="Danh sách bài học" 
              style={{ borderRadius: "12px", height: "100%" }}
              styles={{ body: { padding: 0, maxHeight: "calc(100vh - 150px)", overflowY: "auto" } }}
            >
              <List
                itemLayout="horizontal"
                dataSource={lessons}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => setActiveLesson(item)}
                    style={{
                      padding: "16px",
                      cursor: "pointer",
                      background: activeLesson.id === item.id ? "#e6f7ff" : "transparent",
                      borderLeft: activeLesson.id === item.id ? "4px solid #1890ff" : "4px solid transparent",
                      transition: "all 0.3s"
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        item.isCompleted ? (
                          <CheckCircleFilled style={{ color: "#52c41a", fontSize: "24px" }} />
                        ) : (
                          <PlayCircleOutlined 
                            style={{ 
                              color: activeLesson.id === item.id ? "#1890ff" : "#ccc", 
                              fontSize: "24px" 
                            }} 
                          />
                        )
                      }
                      title={
                        <Text strong={activeLesson.id === item.id} style={{ color: activeLesson.id === item.id ? "#1890ff" : "inherit" }}>
                          {item.title}
                        </Text>
                      }
                      description={
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                          <Text type="secondary" style={{ fontSize: "12px" }}>{item.duration}</Text>
                          {activeLesson.id === item.id && <Tag color="blue">Đang học</Tag>}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Learning;