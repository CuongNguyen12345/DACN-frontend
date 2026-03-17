<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate, useLocation } from "react-router-dom";
>>>>>>> nhanh_cua_Hao
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    RotateCcw,
    Trophy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PracticeResult = () => {
    const navigate = useNavigate();
<<<<<<< HEAD
=======
    const location = useLocation();
    const userAnswers = location.state?.userAnswers || {}; // Thêm dòng này để nhận đáp án

>>>>>>> nhanh_cua_Hao
    // Mock Result Data
    const result = {
        score: 8.4,
        correct: 42,
        total: 50,
        timeTaken: "85:12",
        analysis: [
            { topic: "Hàm số", correct: 18, total: 20, percent: 90 },
            { topic: "Mũ & Logarit", correct: 10, total: 10, percent: 100 },
            { topic: "Nguyên hàm", correct: 8, total: 12, percent: 66 },
            { topic: "Hình học không gian", correct: 6, total: 8, percent: 75 }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 flex justify-center">
            <div className="w-full max-w-3xl space-y-6">

                {/* Score Card */}
                <Card className="overflow-hidden border-none shadow-lg">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white text-center">
                        <div className="inline-flex p-3 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
                            <Trophy className="h-8 w-8 text-yellow-300" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Khá tốt!</h2>
                        <p className="text-blue-100 mb-8">Bạn đã hoàn thành bài thi xuất sắc.</p>

                        <div className="relative inline-flex items-center justify-center mb-6">
                            {/* Simple circular progress visualization using SVG since Shadcn is linear only by default */}
                            <svg className="h-40 w-40" viewBox="0 0 100 100">
                                <circle
                                    className="text-blue-800/40 stroke-current"
                                    strokeWidth="8"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                />
                                <circle
                                    className="text-white progress-ring__circle stroke-current"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * result.score) / 10}
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center text-white">
                                <span className="text-5xl font-bold">{result.score}</span>
                                <span className="text-sm opacity-80">Điểm</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8 text-blue-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{result.correct}/{result.total}</p>
                                <p className="text-xs">Câu đúng</p>
                            </div>
                            <div className="w-px bg-blue-400/30"></div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{result.timeTaken}</p>
                                <p className="text-xs">Thời gian</p>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-8">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate("/practice")}
                                className="border-gray-300"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Làm bài khác
                            </Button>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700"
<<<<<<< HEAD
=======
                                onClick={() => navigate("/practice/review/1", { state: { userAnswers } })}
>>>>>>> nhanh_cua_Hao
                            >
                                Xem chi tiết lời giải <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Analytics Card */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Phân tích kết quả</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {result.analysis.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.topic}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-medium">
                                            {item.correct}/{item.total} <span className="text-muted-foreground">({item.percent}%)</span>
                                        </span>
                                    </div>
                                </div>
                                <Progress value={item.percent} className="h-2.5" indicatorColor={
                                    item.percent >= 80 ? "bg-green-500" : item.percent >= 50 ? "bg-blue-500" : "bg-red-500"
                                } />
                                <div className="mt-2 text-right">
                                    {item.percent < 50 && <Badge variant="destructive" className="text-[10px] px-1.5 h-5">Cần ôn tập thêm</Badge>}
                                    {item.percent >= 90 && <Badge variant="default" className="text-[10px] px-1.5 h-5 bg-green-600 hover:bg-green-700">Nắm chắc kiến thức</Badge>}
                                </div>
                                {index < result.analysis.length - 1 && <Separator className="mt-4" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PracticeResult;
