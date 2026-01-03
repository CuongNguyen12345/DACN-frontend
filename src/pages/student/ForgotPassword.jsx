import { useState } from "react";
import { Card, Form, Input, Button, Typography, Row, Col, Avatar, message } from "antd";
import { 
  MailOutlined, 
  SafetyOutlined, 
  LockOutlined,
  ArrowLeftOutlined,
  SendOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function ForgotPassword() {
//   const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [confirmHover, setConfirmHover] = useState(false);

  // Xử lý gửi mã OTP
  const handleSendOtp = async () => {
    try {
      // Validate trường email trước khi gửi
      await form.validateFields(['email']);
      const email = form.getFieldValue('email');
      
      setSendingOtp(true);
      console.log("Sending OTP to:", email);
      
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng nhập email hợp lệ trước khi gửi mã!");
      } else {
        console.error("Send OTP error:", error);
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // Xử lý xác nhận đổi mật khẩu
  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("Confirm values:", values);
      // TODO: Implement reset password logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("Xác thực thành công! Vui lòng đặt lại mật khẩu.");
      // navigate("/reset-password"); // Điều hướng tiếp theo
    } catch (error) {
      console.error("Confirm error:", error);
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
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Avatar 
                size={80} 
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
                  marginBottom: '16px'
                }} 
                icon={<LockOutlined style={{ fontSize: '40px', color: '#fff' }} />} 
              />
              <Title level={2} style={{ margin: '16px 0 8px 0', color: '#1890ff' }}>
                Quên mật khẩu
              </Title>
              <Paragraph style={{ color: '#666', fontSize: '16px' }}>
                Nhập email để nhận mã xác thực OTP
              </Paragraph>
            </div>

            {/* Form */}
            <Form
              form={form}
              name="forgot-password"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
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
                name="otp"
                rules={[
                  { required: true, message: "Vui lòng nhập mã OTP!" },
                  { len: 6, message: "Mã OTP phải có 6 ký tự!" }
                ]}
              >
                <Input
                  prefix={<SafetyOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Nhập mã OTP"
                  style={{ borderRadius: '8px' }}
                  maxLength={6}
                />
              </Form.Item>

              <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={12}>
                  <Button 
                    block 
                    icon={<SendOutlined />}
                    onClick={handleSendOtp}
                    loading={sendingOtp}
                    style={{ borderRadius: '8px', height: '48px' }}
                  >
                    Gửi mã
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                    loading={loading}
                    onMouseEnter={() => setConfirmHover(true)}
                    onMouseLeave={() => setConfirmHover(false)}
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      background: confirmHover 
                        ? 'linear-gradient(135deg, #FFC107 0%, #1890ff 100%)' 
                        : 'linear-gradient(135deg, #1890ff 0%, #FFC107 100%)',
                      border: 'none',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                  >
                    Xác nhận
                  </Button>
                </Col>
              </Row>

              <div style={{ textAlign: 'center' }}>
                <Link to="/" style={{ color: '#666', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeftOutlined /> Quay lại đăng nhập
                </Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ForgotPassword;