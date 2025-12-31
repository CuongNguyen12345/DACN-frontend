import { Layout, Typography, Button, Space, Avatar } from "antd";

import { BookOutlined, UserOutlined } from "@ant-design/icons";

import { Outlet, Link } from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const StudentLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Header */}
      <Header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 50px",
        }}
      >
        <Space size="large">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              size={40}
              style={{ background: "#1890ff" }}
              icon={<BookOutlined />}
            />
            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
              Hệ thống Học tập Edu4All
            </Title>
          </div>
        </Space>
        <Space>
          <Link to="/login">
            <Button type="text" icon={<UserOutlined />}>
              Đăng nhập
            </Button>
          </Link>
          <Link to="/register">
            <Button type="primary">Đăng ký</Button>
          </Link>
        </Space>
      </Header>

      <Content style={{ padding: 0 }}>
        <Outlet />
      </Content>

      {/* Footer */}
      <Footer
        style={{ textAlign: "center", background: "#1890ff", color: "#fff" }}
      >
        <Paragraph style={{ color: "#fff", margin: 0 }}>
          Hệ thống Học tập Edu4All ©2025 - Phát triển bởi DACN
        </Paragraph>
      </Footer>
    </Layout>
  );
};

export default StudentLayout;
