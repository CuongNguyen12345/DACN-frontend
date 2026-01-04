import { useState } from "react";
import { Radio, Button, Alert, Space, Typography, Card } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const QuizTab = () => {
    const [submitted, setSubmitted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [result, setResult] = useState(null); // 'correct' | 'incorrect'

    const question = {
        content: "Đồ thị hàm số y = ax^3 + bx^2 + cx + d (a ≠ 0) có 2 điểm cực trị khi và chỉ khi:",
        options: [
            { id: "A", text: "Phương trình y' = 0 có 2 nghiệm phân biệt" },
            { id: "B", text: "Phương trình y' = 0 có nghiệm kép" },
            { id: "C", text: "Phương trình y' = 0 vô nghiệm" },
            { id: "D", text: "a và c trái dấu" }
        ],
        correctAnswer: "A",
        explanation: "Hàm số bậc 3 có 2 điểm cực trị <=> y' là tam thức bậc 2 có 2 nghiệm phân biệt <=> Delta_y' > 0."
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;
        setSubmitted(true);
        if (selectedAnswer === question.correctAnswer) {
            setResult("correct");
        } else {
            setResult("incorrect");
        }
    };

    const handleRetry = () => {
        setSubmitted(false);
        setSelectedAnswer(null);
        setResult(null);
    };

    return (
        <div className="quiz-tab">
            <Title level={5}>Bài tập trắc nghiệm nhanh</Title>

            <Card style={{ marginBottom: "16px" }}>
                <Paragraph strong>{question.content}</Paragraph>
                <Radio.Group
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    value={selectedAnswer}
                    disabled={submitted}
                >
                    <Space direction="vertical">
                        {question.options.map(opt => (
                            <Radio key={opt.id} value={opt.id}>
                                <strong>{opt.id}.</strong> {opt.text}
                            </Radio>
                        ))}
                    </Space>
                </Radio.Group>
            </Card>

            {!submitted ? (
                <Button type="primary" onClick={handleSubmit} disabled={!selectedAnswer}>
                    Nộp bài
                </Button>
            ) : (
                <div className="quiz-result">
                    {result === "correct" ? (
                        <Alert
                            message="Chính xác!"
                            description={
                                <div>
                                    <p>{question.explanation}</p>
                                    <Button size="small" onClick={handleRetry}>Làm lại</Button>
                                </div>
                            }
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                        />
                    ) : (
                        <Alert
                            message="Chưa đúng rồi!"
                            description={
                                <div>
                                    <p>Đáp án đúng là <strong>{question.correctAnswer}</strong>.</p>
                                    <p>{question.explanation}</p>
                                    <Button size="small" onClick={handleRetry}>Làm lại</Button>
                                </div>
                            }
                            type="error"
                            showIcon
                            icon={<CloseCircleOutlined />}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizTab;
