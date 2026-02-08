import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

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
        <div className="p-4 space-y-6">
            <h3 className="font-semibold text-lg">Bài tập trắc nghiệm nhanh</h3>

            <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                    <p className="font-medium text-lg mb-4">{question.content}</p>
                    <RadioGroup
                        value={selectedAnswer}
                        onValueChange={setSelectedAnswer}
                        disabled={submitted}
                        className="space-y-3"
                    >
                        {question.options.map((opt) => (
                            <div key={opt.id} className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent">
                                <RadioGroupItem value={opt.id} id={opt.id} />
                                <Label htmlFor={opt.id} className="flex-1 cursor-pointer font-normal">
                                    <span className="font-bold mr-2">{opt.id}.</span>
                                    {opt.text}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {!submitted ? (
                <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full sm:w-auto">
                    Nộp bài
                </Button>
            ) : (
                <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-5">
                    {result === "correct" ? (
                        <Alert variant="success" className="bg-green-50 border-green-200 text-green-900">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle>Chính xác!</AlertTitle>
                            <AlertDescription className="mt-2">
                                <p>{question.explanation}</p>
                                <Button size="sm" variant="outline" onClick={handleRetry} className="mt-3 border-green-600 text-green-700 hover:bg-green-100">
                                    Làm lại
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <AlertTitle>Chưa đúng rồi!</AlertTitle>
                            <AlertDescription className="mt-2">
                                <p className="mb-2">Đáp án đúng là <strong>{question.correctAnswer}</strong>.</p>
                                <p>{question.explanation}</p>
                                <Button size="sm" variant="outline" onClick={handleRetry} className="mt-3 border-red-600 text-red-700 hover:bg-red-100">
                                    Làm lại
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizTab;
