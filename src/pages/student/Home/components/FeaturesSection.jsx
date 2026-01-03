import { Card, Row, Col, Typography } from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
const { Title, Paragraph } = Typography;

const FeaturesSection = () => {
  return (
    <div className="home-features">
      <div className="home-features__header">
        <Title level={2}>Tính năng nổi bật</Title>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="feature-card">
            <VideoCameraOutlined
              className="feature-card__icon"
              style={{ color: "#1890ff" }}
            />
            <Title level={4} className="feature-card__title">
              Video bài giảng
            </Title>
            <Paragraph>
              Hàng trăm video bài giảng chất lượng cao, dễ hiểu
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="feature-card">
            <FileTextOutlined
              className="feature-card__icon"
              style={{ color: "#FFC107" }}
            />
            <Title level={4} className="feature-card__title">
              Tài liệu phong phú
            </Title>
            <Paragraph>
              Đầy đủ tài liệu, đề thi và bài tập từ cơ bản đến nâng cao
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="feature-card">
            <ClockCircleOutlined
              className="feature-card__icon"
              style={{ color: "#1890ff" }}
            />
            <Title level={4} className="feature-card__title">
              Học mọi lúc mọi nơi
            </Title>
            <Paragraph>
              Học tập linh hoạt theo thời gian và tiến độ của bạn
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="feature-card">
            <TrophyOutlined
              className="feature-card__icon"
              style={{ color: "#FFC107" }}
            />
            <Title level={4} className="feature-card__title">
              Theo dõi tiến độ
            </Title>
            <Paragraph>
              Theo dõi quá trình học tập và thành tích của bạn
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturesSection;
