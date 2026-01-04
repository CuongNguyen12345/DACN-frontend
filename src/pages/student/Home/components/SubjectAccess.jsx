import { Row, Col, Card, Avatar, Typography } from "antd";
import { TbMathSymbols } from "react-icons/tb";
import { FaAtom, FaFlask, FaBookOpen } from "react-icons/fa";
import { GiDna1 } from "react-icons/gi";
import { MdTranslate } from "react-icons/md";

const { Title } = Typography;

const SubjectAccess = () => {
    const subjects = [
        { id: 1, name: "Toán học", icon: <TbMathSymbols />, color: "#1890ff" },
        { id: 2, name: "Vật lý", icon: <FaAtom />, color: "#FFC107" },
        { id: 3, name: "Hóa học", icon: <FaFlask />, color: "#FF6B35" },
        { id: 4, name: "Sinh học", icon: <GiDna1 />, color: "#4ECDC4" },
        { id: 5, name: "Ngữ văn", icon: <FaBookOpen />, color: "#9B59B6" },
        { id: 6, name: "Tiếng Anh", icon: <MdTranslate />, color: "#F39C12" },
    ];

    return (
        <div className="subject-access">
            <Title level={4} style={{ marginBottom: "16px" }}>Truy cập nhanh</Title>
            <Row gutter={[16, 16]}>
                {subjects.map((subject) => (
                    <Col xs={12} md={8} lg={4} key={subject.id}>
                        <Card hoverable className="subject-item" bodyStyle={{ padding: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Avatar
                                size={48}
                                style={{ background: subject.color, marginBottom: "8px" }}
                                icon={subject.icon}
                            />
                            <Title level={5} style={{ fontSize: "14px", margin: 0, textAlign: "center" }}>
                                {subject.name}
                            </Title>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SubjectAccess;
