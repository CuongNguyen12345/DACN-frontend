import { useState } from "react";
import { Card, Form, Input, Button, Typography, Space, Row, Col, Divider, Avatar, Checkbox } from "antd";
import { UserOutlined, LockOutlined, BookOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("Login values:", values);
      // TODO: Implement login logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
        <Col xs={24} sm={24} md={12} lg={10} xl={8}>
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: 'none'
            }}
          >
            {/* Logo và Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Avatar 
                size={80} 
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
                  marginBottom: '16px'
                }} 
                icon={<BookOutlined style={{ fontSize: '40px', color: '#fff' }} />} 
              />
              <Title level={2} style={{ margin: '16px 0 8px 0', color: '#1890ff' }}>
                Đăng nhập
              </Title>
              <Paragraph style={{ color: '#666', fontSize: '16px' }}>
                Chào mừng bạn trở lại Edu4All
              </Paragraph>
            </div>

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập hoặc email!" },
                  { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Tên đăng nhập hoặc Email"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Mật khẩu"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password" style={{ color: '#1890ff', fontSize: '14px' }}>
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
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <Divider>
              <Text type="secondary" style={{ fontSize: '14px' }}>Hoặc</Text>
            </Divider>

            {/* Social Login */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                icon={<GoogleOutlined />}
                block
                size="large"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  borderColor: '#db4437',
                  color: '#db4437'
                }}
              >
                Đăng nhập với Google
              </Button>
            </Space>

            {/* Register Link */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                Chưa có tài khoản?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#1890ff', 
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Đăng ký ngay
                </Link>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
