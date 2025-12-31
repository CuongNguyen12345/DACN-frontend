import { useState } from "react";
import { Card, Form, Input, Button, Typography, Space, Row, Col, Divider, Avatar, Checkbox } from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  BookOutlined, 
  GoogleOutlined, 
  FacebookOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("Register values:", values);
      // TODO: Implement register logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
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
        <Col xs={24} sm={24} md={16} lg={12} xl={10}>
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
                Đăng ký tài khoản
              </Title>
              <Paragraph style={{ color: '#666', fontSize: '16px' }}>
                Tạo tài khoản để bắt đầu học tập cùng Edu4All
              </Paragraph>
            </div>

            {/* Register Form */}
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              autoComplete="off"
              scrollToFirstError
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                      { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Nhập họ và tên"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                      { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!" }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Nhập tên đăng nhập"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

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
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
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
                  <Link to="/terms" style={{ color: '#1890ff' }}>
                    Điều khoản sử dụng
                  </Link>
                  {' '}và{' '}
                  <Link to="/privacy" style={{ color: '#1890ff' }}>
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
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>


            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                Đã có tài khoản?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#1890ff', 
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Đăng nhập ngay
                </Link>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Register;

