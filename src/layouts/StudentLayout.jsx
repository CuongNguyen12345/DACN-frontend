import { useState } from "react";
import { Layout, Typography, Button, Space, Avatar, Menu, Input, Popover, Select, Dropdown } from "antd";
import { BookOutlined, UserOutlined, SearchOutlined, MoonOutlined, SunOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AuthModal from "./components/AuthModal";

const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const StudentLayout = () => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalVisible(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Filter Content for Advanced Search
  const searchFilterContent = (
    <div style={{ padding: "8px", minWidth: "300px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Text strong>Bộ lọc tìm kiếm</Typography.Text>
        <Space>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Select.Option value="all">Tất cả lớp</Select.Option>
            <Select.Option value="10">Lớp 10</Select.Option>
            <Select.Option value="11">Lớp 11</Select.Option>
            <Select.Option value="12">Lớp 12</Select.Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Select.Option value="all">Tất cả môn</Select.Option>
            <Select.Option value="math">Toán</Select.Option>
            <Select.Option value="physics">Lý</Select.Option>
            <Select.Option value="chemistry">Hóa</Select.Option>
          </Select>
        </Space>
      </Space>
    </div>
  );

  const menuItems = [
    { key: "dashboard", label: "Trang chủ" },
    { key: "practice", label: "Luyện đề" },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "dashboard") navigate("/");
    if (e.key === "practice") navigate("/practice");
  };

  const getSelectedKey = () => {
    if (location.pathname.startsWith("/practice")) return "practice";
    return "dashboard";
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
        Hồ sơ cá nhân
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

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
          padding: "0 24px",
          gap: "16px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" }}>
          <Avatar
            size={32}
            style={{ background: "#1890ff" }}
            icon={<BookOutlined />}
          />
          <Title level={4} style={{ margin: 0, color: "#1890ff", whiteSpace: "nowrap" }}>
            Edu4All
          </Title>
        </div>

        {/* Advanced Search */}
        <div style={{ flex: 1, maxWidth: "400px", display: "flex", justifyContent: "center" }}>
          <Popover
            content={searchFilterContent}
            trigger="click"
            placement="bottomLeft"
            arrow={false}
          >
            <Input.Search
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
              enterButton="Tìm kiếm"
              size="middle"
              style={{ width: "100%" }}
            />
          </Popover>
        </div>

        {/* Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            borderBottom: "none",
            background: "transparent",
            justifyContent: "center"
          }}
        />

        {/* Right Section */}
        <Space size="middle">
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleDarkMode}
            style={{ fontSize: "16px" }}
          />

          {isLoggedIn ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar
                style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          ) : (
            <Space>
              <Button
                type="text"
                onClick={() => openAuthModal("login")}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                onClick={() => openAuthModal("register")}
              >
                Đăng ký
              </Button>
            </Space>
          )}
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
          Hệ thống Học tập Edu4All ©{new Date().getFullYear()} - Phát triển bởi DACN
        </Paragraph>
      </Footer>

      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Layout>
  );
};

export default StudentLayout;
