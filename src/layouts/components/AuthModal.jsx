import { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button, Checkbox, Typography, Divider, Space, Avatar, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  BookOutlined,
  GoogleOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./AuthModal.css";

const { Title, Text, Paragraph } = Typography;

const AuthModal = ({ isVisible, onClose, initialMode = "login" }) => {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loginHover, setLoginHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);

  // Reset tab when modal opens/closes or initialMode changes
  useEffect(() => {
    if (isVisible) {
      setActiveTab(initialMode);
    }
  }, [isVisible, initialMode]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Mock API call or use real one
      // const response = await api.post("/login", values);
      console.log("Login values:", values);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Simulate success
      alert("Đăng nhập thành công!");
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Đăng nhập thất bại: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      console.log("Register values:", values);
      // TODO: Implement register logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setActiveTab("login"); // Switch to login tab after success
      registerForm.resetFields();
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginContent = (
    <Form
      form={loginForm}
      name="login"
      onFinish={handleLogin}
      layout="vertical"
      size="large"
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên đăng nhập hoặc email!",
          },
          { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
        ]}
      >
        <Input
          prefix={<UserOutlined style={{ color: "#1890ff" }} />}
          placeholder="Tên đăng nhập hoặc Email"
          style={{ borderRadius: "8px" }}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "#1890ff" }} />}
          placeholder="Mật khẩu"
          style={{ borderRadius: "8px" }}
        />
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            onClick={onClose}
            style={{ color: "#1890ff", fontSize: "14px" }}
          >
            Quên mật khẩu?
          </Link>
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          onMouseEnter={() => setLoginHover(true)}
          onMouseLeave={() => setLoginHover(false)}
          style={{
            height: "48px",
            borderRadius: "8px",
            background: loginHover
              ? "linear-gradient(135deg, #FFC107 0%, #1890ff 100%)"
              : "linear-gradient(135deg, #1890ff 0%, #FFC107 100%)",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.7s",
          }}
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <Divider>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Hoặc
        </Text>
      </Divider>

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          className="google-login-btn"
        >
          Đăng nhập với Google
        </Button>
      </Space>
    </Form>
  );

  const registerContent = (
    <Form
      form={registerForm}
      name="register"
      onFinish={handleRegister}
      layout="vertical"
      size="large"
      autoComplete="off"
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="Tên đăng nhập"
        rules={[
          { required: true, message: "Vui lòng nhập tên đăng nhập!" },
          { min: 7, message: "Tên đăng nhập phải có ít nhất 7 ký tự!" },
          { pattern: /^[a-zA-Z0-9]+$/, message: "Tên đăng nhập không được chứa dấu tiếng Việt, khoảng trắng và ký tự đặc biệt!" },
          { pattern: /\d/, message: "Tên đăng nhập phải chứa ít nhất một chữ số!" }
        ]}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#1890ff' }} />}
          placeholder="Nhập tên đăng nhập"
          style={{ borderRadius: '8px' }}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: 'email', message: "Email không hợp lệ!" }
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: '#1890ff' }} />}
          placeholder="Nhập địa chỉ email"
          style={{ borderRadius: '8px' }}
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại (Tùy chọn)"
        rules={[
          { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" }
        ]}
      >
        <Input
          prefix={<PhoneOutlined style={{ color: '#1890ff' }} />}
          placeholder="Nhập số điện thoại"
          style={{ borderRadius: '8px' }}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 9, message: "Mật khẩu phải có trên 8 ký tự!" },
              {
                pattern: /(?=.*\d)(?=.*[^a-zA-Z0-9])/,
                message: "Mật khẩu phải có ít nhất 1 số và 1 ký tự đặc biệt!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Nhập mật khẩu"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Nhập lại mật khẩu"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Bạn cần đồng ý với điều khoản sử dụng!')),
          },
        ]}
      >
        <Checkbox>
          Tôi đồng ý với{' '}
          <Link to="/terms" onClick={onClose} style={{ color: '#1890ff' }}>
            Điều khoản sử dụng
          </Link>
          {' '}và{' '}
          <Link to="/privacy" onClick={onClose} style={{ color: '#1890ff' }}>
            Chính sách bảo mật
          </Link>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          onMouseEnter={() => setRegisterHover(true)}
          onMouseLeave={() => setRegisterHover(false)}
          style={{
            height: '48px',
            borderRadius: '8px',
            background: registerHover
              ? 'linear-gradient(135deg, #FFC107 0%, #1890ff 100%)'
              : 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.7s'
          }}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600} // Wider modal for register form
      centered
      maskClosable={false}
    >
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Avatar
            size={64}
            style={{
              background: "linear-gradient(135deg, #1890ff 0%, #FFC107 100%)",
              marginBottom: "16px",
            }}
            icon={<BookOutlined style={{ fontSize: "32px", color: "#fff" }} />}
          />
          <Title level={3} style={{ margin: "0 0 8px 0", color: "#1890ff" }}>
            Edu4All
          </Title>
          <Paragraph type="secondary">
            Hệ thống học tập trực tuyến
          </Paragraph>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'login',
              label: 'Đăng nhập',
              children: loginContent,
            },
            {
              key: 'register',
              label: 'Đăng ký',
              children: registerContent,
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default AuthModal;
