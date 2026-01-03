import { Card, Row, Col, Statistic } from "antd";
import {
  FileTextOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
const Statistics = () => {
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
    <div className="home-stats">
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
  );
};

export default Statistics;
