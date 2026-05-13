import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    FlaskConical,
    ListChecks,
    PlayCircle,
    RotateCcw,
    XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { useExamSecuritySettings } from "@/hooks/useExamSecuritySettings";
import { shouldRevealExamResult } from "@/lib/examSecuritySettings";

const getQuizAnswerStorageKey = (quizId) => `lesson_quiz_answers_${quizId}`;
const getQuizEndTimeStorageKey = (quizId) => `lesson_quiz_end_time_${quizId}`;

const formatTime = (seconds) => {
    const safeSeconds = Math.max(Number(seconds) || 0, 0);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const getSavedAnswers = (quizId) => {
    if (!quizId) return {};

    try {
        return JSON.parse(localStorage.getItem(getQuizAnswerStorageKey(quizId)) || "{}");
    } catch {
        return {};
    }
};

const QuizTab = ({
    lessonId,
    quizzes = [],
    selectedQuizId,
    onSelectQuiz,
}) => {
    const [quizDetail, setQuizDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const examSecuritySettings = useExamSecuritySettings();
    const revealResult = shouldRevealExamResult(examSecuritySettings);

    const selectedQuiz = useMemo(() => {
        if (!quizzes.length) return null;
        return (
            quizzes.find((quiz) => Number(quiz.id) === Number(selectedQuizId)) ||
            quizzes[0]
        );
    }, [quizzes, selectedQuizId]);
    const selectedQuizIdValue = selectedQuiz?.id;

    useEffect(() => {
        if (selectedQuiz && Number(selectedQuiz.id) !== Number(selectedQuizId)) {
            onSelectQuiz?.(selectedQuiz.id);
        }
    }, [onSelectQuiz, selectedQuiz, selectedQuizId]);

    useEffect(() => {
        if (!selectedQuiz?.id) {
            return undefined;
        }

        let shouldIgnore = false;
        const savedAnswers = getSavedAnswers(selectedQuiz.id);

        queueMicrotask(() => {
            if (shouldIgnore) return;
            setIsLoading(true);
            setError("");
            setStarted(false);
            setSubmitted(false);
            setScore(null);
            setSubmitResult(null);
            setAnswers(savedAnswers);
            setCurrentQuestionIndex(0);
            setTimeLeft(0);
        });

        api.get(`/api/learning/quizzes/${selectedQuiz.id}`)
            .then((response) => {
                if (!shouldIgnore) {
                    setQuizDetail(response.data);
                }
            })
            .catch((err) => {
                console.error("Không thể tải bài tập:", err);
                if (!shouldIgnore) {
                    setQuizDetail(null);
                    setError("Không thể tải nội dung bài tập. Vui lòng thử lại.");
                }
            })
            .finally(() => {
                if (!shouldIgnore) {
                    setIsLoading(false);
                }
            });

        return () => {
            shouldIgnore = true;
        };
    }, [selectedQuiz?.id]);

    const questions = useMemo(() => quizDetail?.questions || [], [quizDetail?.questions]);
    const answeredCount = Object.keys(answers).length;
    const hasProgress = answeredCount > 0;
    const durationSeconds = Math.max(
        Number(quizDetail?.duration || selectedQuiz?.duration || 0) * 60,
        0,
    );
    const passingScore = Number(quizDetail?.passingScore || selectedQuiz?.passingScore || 0);
    const scorePercent = submitResult?.scorePercent ?? (score?.total
        ? Math.round((score.correct / score.total) * 100)
        : 0);
    const isPassed = submitResult?.passed ?? scorePercent >= passingScore;
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (currentQuestionIndex < questions.length) return;
        queueMicrotask(() => {
            setCurrentQuestionIndex(Math.max(questions.length - 1, 0));
        });
    }, [currentQuestionIndex, questions.length]);

    const handleAnswerSelect = (questionId, optionLabel) => {
        const nextAnswers = {
            ...answers,
            [questionId]: optionLabel,
        };
        setAnswers(nextAnswers);
        localStorage.setItem(
            getQuizAnswerStorageKey(selectedQuiz.id),
            JSON.stringify(nextAnswers),
        );
    };

    const handleSubmit = useCallback(() => {
        const correctCount = questions.reduce((count, question) => {
            const correctOption = question.options?.find((option) => option.correct);
            return answers[question.id] === correctOption?.label ? count + 1 : count;
        }, 0);

        setScore({
            correct: correctCount,
            total: questions.length,
        });
        setSubmitted(true);
        if (selectedQuizIdValue) {
            localStorage.removeItem(getQuizEndTimeStorageKey(selectedQuizIdValue));
            api.post(`/api/learning/quizzes/${selectedQuizIdValue}/submit`, { answers })
                .then((response) => {
                    setSubmitResult(response.data);
                    setScore({
                        correct: Number(response.data?.correct) || correctCount,
                        total: Number(response.data?.total) || questions.length,
                    });
                })
                .catch((err) => {
                    console.error("Không thể cập nhật điểm thông thạo:", err);
                });
        }
    }, [answers, questions, selectedQuizIdValue]);

    useEffect(() => {
        if (!started || submitted || !selectedQuiz?.id) return undefined;

        const timer = window.setInterval(() => {
            const endTime = Number(localStorage.getItem(getQuizEndTimeStorageKey(selectedQuiz.id)));
            const remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
            setTimeLeft(remaining);

            if (remaining <= 0) {
                window.clearInterval(timer);
                handleSubmit();
            }
        }, 1000);

        return () => window.clearInterval(timer);
    }, [handleSubmit, selectedQuiz?.id, started, submitted]);

    const handleStart = () => {
        if (!selectedQuiz?.id) return;

        const savedEndTime = Number(localStorage.getItem(getQuizEndTimeStorageKey(selectedQuiz.id)));
        const remaining = Math.max(Math.ceil((savedEndTime - Date.now()) / 1000), 0);
        const nextTimeLeft = remaining > 0 ? remaining : durationSeconds;
        const nextEndTime = Date.now() + nextTimeLeft * 1000;

        localStorage.setItem(getQuizEndTimeStorageKey(selectedQuiz.id), String(nextEndTime));
        setTimeLeft(nextTimeLeft);
        setCurrentQuestionIndex(0);
        setStarted(true);
    };

    const handleRetry = () => {
        localStorage.removeItem(getQuizAnswerStorageKey(selectedQuiz.id));
        localStorage.removeItem(getQuizEndTimeStorageKey(selectedQuiz.id));
        const nextEndTime = Date.now() + durationSeconds * 1000;
        localStorage.setItem(getQuizEndTimeStorageKey(selectedQuiz.id), String(nextEndTime));
        setAnswers({});
        setSubmitted(false);
        setScore(null);
        setSubmitResult(null);
        setCurrentQuestionIndex(0);
        setTimeLeft(durationSeconds);
        setStarted(true);
    };

    if (!quizzes.length) {
        return (
            <div className="p-6">
                <Card className="border-dashed bg-slate-50/70">
                    <CardContent className="py-10 text-center space-y-3">
                        <FlaskConical className="mx-auto h-10 w-10 text-slate-400" />
                        <h3 className="text-base font-semibold text-slate-900">
                            Chưa có bài tập cho chương này
                        </h3>
                        <p className="text-sm text-slate-500">
                            Bài tập giáo viên tạo theo topic/chương sẽ hiển thị tại đây.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-5">
            {quizzes.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {quizzes.map((quiz) => (
                        <Button
                            key={quiz.id}
                            type="button"
                            variant={Number(selectedQuiz?.id) === Number(quiz.id) ? "default" : "outline"}
                            size="sm"
                            className="shrink-0"
                            onClick={() => onSelectQuiz?.(quiz.id)}
                        >
                            {quiz.title}
                        </Button>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div className="py-12 text-center text-sm text-slate-500">
                    Đang tải bài tập...
                </div>
            ) : error ? (
                <Alert className="border-red-200 bg-red-50 text-red-900">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle>Không tải được bài tập</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : !started ? (
                <Card className="border-l-4 border-l-blue-600">
                    <CardContent className="p-6 space-y-5">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-600">
                                Bài tập trong chương của bài {lessonId}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {quizDetail?.title || selectedQuiz?.title}
                            </h3>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-md border bg-white p-3 text-sm text-slate-600">
                                <ListChecks className="mb-2 h-4 w-4 text-blue-600" />
                                {questions.length || selectedQuiz?.questionCount || 0} câu hỏi
                            </div>
                            <div className="rounded-md border bg-white p-3 text-sm text-slate-600">
                                <Clock className="mb-2 h-4 w-4 text-blue-600" />
                                {quizDetail?.duration || selectedQuiz?.duration || 0} phút · {quizDetail?.difficulty || selectedQuiz?.difficulty || "Dễ"}
                            </div>
                            <div className="rounded-md border bg-white p-3 text-sm text-slate-600">
                                <CheckCircle2 className="mb-2 h-4 w-4 text-blue-600" />
                                Đạt {quizDetail?.passingScore || selectedQuiz?.passingScore || 0}%
                            </div>
                        </div>

                        <Button
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                            onClick={handleStart}
                            disabled={questions.length === 0}
                        >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            {hasProgress ? "Làm tiếp" : "Bắt đầu làm bài"}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                {quizDetail?.title || selectedQuiz?.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                                Câu {Math.min(currentQuestionIndex + 1, questions.length)}/{questions.length} · Đã làm {answeredCount}/{questions.length} câu
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className={cn(
                                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold",
                                timeLeft <= 60
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-blue-200 bg-blue-50 text-blue-700",
                            )}>
                                <Clock className="h-4 w-4" />
                                {formatTime(timeLeft)}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRetry}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Làm lại
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 rounded-lg border bg-slate-50 p-3">
                        {questions.map((question, index) => (
                            <Button
                                key={question.id}
                                type="button"
                                variant={currentQuestionIndex === index ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0",
                                    answers[question.id] &&
                                        currentQuestionIndex !== index &&
                                        "border-blue-200 bg-blue-50 text-blue-700",
                                )}
                                onClick={() => setCurrentQuestionIndex(index)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>

                    {currentQuestion ? (
                        <Card className="border-l-4 border-l-primary">
                            <CardContent className="pt-6">
                                <p className="mb-4 text-base font-medium leading-relaxed">
                                    Câu {currentQuestionIndex + 1}. {currentQuestion.content}
                                </p>

                                <RadioGroup
                                    value={answers[currentQuestion.id] || ""}
                                    onValueChange={(value) =>
                                        handleAnswerSelect(currentQuestion.id, value)
                                    }
                                    disabled={submitted}
                                    className="space-y-3"
                                >
                                    {(currentQuestion.options || []).map((option) => {
                                        const selectedAnswer = answers[currentQuestion.id] || "";
                                        const correctOption = currentQuestion.options?.find((item) => item.correct);
                                        const isCorrect = revealResult && submitted && option.correct;
                                        const isWrong =
                                            revealResult &&
                                            submitted &&
                                            selectedAnswer === option.label &&
                                            selectedAnswer !== correctOption?.label;

                                        return (
                                            <div
                                                key={option.label}
                                                className={cn(
                                                    "flex items-center space-x-3 rounded-md border p-3 transition-colors",
                                                    submitted
                                                        ? "cursor-default"
                                                        : "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                                    selectedAnswer === option.label &&
                                                        "border-primary bg-accent",
                                                    isCorrect && "border-green-300 bg-green-50",
                                                    isWrong && "border-red-300 bg-red-50",
                                                )}
                                            >
                                                <RadioGroupItem
                                                    value={option.label}
                                                    id={`${currentQuestion.id}-${option.label}`}
                                                />
                                                <Label
                                                    htmlFor={`${currentQuestion.id}-${option.label}`}
                                                    className="flex-1 cursor-pointer font-normal"
                                                >
                                                    <span className="mr-2 font-bold">
                                                        {option.label}.
                                                    </span>
                                                    {option.content}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>

                                {revealResult && submitted && currentQuestion.explanation && (
                                    <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                                        {currentQuestion.explanation}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex((index) => Math.max(index - 1, 0))}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Câu trước
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setCurrentQuestionIndex((index) =>
                                        Math.min(index + 1, questions.length - 1),
                                    )
                                }
                                disabled={currentQuestionIndex >= questions.length - 1}
                            >
                                Câu sau
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                    {!submitted ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={questions.length === 0 || answeredCount === 0}
                            className="w-full sm:w-auto"
                        >
                            Nộp bài
                        </Button>
                    ) : null}
                    </div>

                    {submitted && !revealResult ? (
                        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <AlertTitle>Đã ghi nhận bài làm!</AlertTitle>
                            <AlertDescription>
                                Kết quả và đáp án sẽ hiển thị khi quản trị viên cho phép.
                            </AlertDescription>
                        </Alert>
                    ) : submitted ? (
                        <Alert className={cn(
                            isPassed
                                ? "border-green-200 bg-green-50 text-green-900"
                                : "border-red-200 bg-red-50 text-red-900",
                        )}>
                            {isPassed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <AlertTitle>
                                {isPassed ? "Đạt" : "Không đạt"} · {scorePercent}% ({score?.correct}/{score?.total} câu đúng)
                            </AlertTitle>
                            <AlertDescription>
                                Điểm đạt yêu cầu: {passingScore}%. Độ khó: {submitResult?.difficulty || quizDetail?.difficulty || selectedQuiz?.difficulty || "Dễ"}.
                                {submitResult?.masteryGain
                                    ? ` Độ thông thạo tăng +${Math.round(submitResult.masteryGain * 100)}%.`
                                    : ""}
                                Bạn có thể xem đáp án và giải thích ngay bên dưới từng câu.
                            </AlertDescription>
                        </Alert>
                    ) : null}
                </>
            )}
        </div>
    );
};

export default QuizTab;
