import { Button } from "@/components/ui/button";
import { BookOpen, Atom, Brain, ArrowRight } from "lucide-react";

const JourneySection = () => {
    return (
        <div className="py-16">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0F4C81]">
                    Chọn Lộ Trình Của Bạn
                </h2>
                <p className="text-gray-600">
                    Dù mục tiêu là lấy gốc hay 9+ Đại học, Edu4All đều có giải pháp.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Lấy Gốc */}
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:translate-y-[-5px] border-t-transparent border-t-4 hover:border-t-[#FF6B50] hover:border-t-4 transition-all border border-gray-100 flex flex-col items-start text-left group">
                    <div className="w-12 h-12 mb-6 text-[#0F4C81]">
                        <BookOpen className="w-full h-full" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Lấy Gốc Kiến Thức</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Hệ thống lại toàn bộ kiến thức nền tảng SGK. Phù hợp cho các bạn mất gốc Toán, Lý, Hóa, Anh.
                    </p>
                    <div className="mt-auto">
                        <Button variant="link" className="text-[#FF6B50] font-bold p-0 hover:no-underline group-hover:gap-2 transition-all">
                            Xem lộ trình <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Card 2: Luyện Thi */}
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:translate-y-[-5px] border-t-transparent border-t-4 hover:border-t-[#FF6B50] hover:border-t-4 transition-all border border-gray-100 flex flex-col items-start text-left group">
                    <div className="w-12 h-12 mb-6 text-[#0F4C81]">
                        <Atom className="w-full h-full" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Luyện Thi THPT QG</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Chiến thuật giải đề tốc độ. Tổng hợp các dạng bài hay xuất hiện trong đề thi 5 năm gần nhất.
                    </p>
                    <div className="mt-auto">
                        <Button variant="link" className="text-[#FF6B50] font-bold p-0 hover:no-underline group-hover:gap-2 transition-all">
                            Luyện đề ngay <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Card 3: Tư Duy */}
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:translate-y-[-5px] border-t-transparent border-t-4 hover:border-t-[#FF6B50] hover:border-t-4 transition-all border border-gray-100 flex flex-col items-start text-left group">
                    <div className="w-12 h-12 mb-6 text-[#0F4C81]">
                        <Brain className="w-full h-full" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tư Duy & Kỹ Năng</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Phương pháp ghi nhớ Mindmap, quản lý thời gian Pomodoro và định hướng nghề nghiệp.
                    </p>
                    <div className="mt-auto">
                        <Button variant="link" className="text-[#FF6B50] font-bold p-0 hover:no-underline group-hover:gap-2 transition-all">
                            Khám phá <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneySection;
