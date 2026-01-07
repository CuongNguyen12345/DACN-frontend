
import { Button } from "@/components/ui/button";

const JourneySection = () => {
    return (
        <div className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-10">
                Bắt đầu hành trình của bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1: Knowledge System */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow text-center flex flex-col items-center">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/student-studying-at-desk-2974919-2477350.png"
                        alt="Hệ thống kiến thức"
                        className="w-48 h-48 object-contain mb-6"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hệ thống kiến thức</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                        Truy cập vào kho bài giảng, lý thuyết và ví dụ chi tiết cho từng môn học.
                    </p>
                    <Button className="bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold px-8 rounded-full border border-blue-200">
                        Bắt đầu học
                    </Button>
                </div>

                {/* Card 2: Practice Exams */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow text-center flex flex-col items-center">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/girl-reading-book-2974922-2477353.png"
                        alt="Luyện đề thi"
                        className="w-48 h-48 object-contain mb-6"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Luyện đề thi</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                        Thử sức với hàng ngàn câu hỏi và đề thi thử được biên soạn kỹ lưỡng.
                    </p>
                    <Button className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold px-8 rounded-full border border-orange-200">
                        Luyện để ngay
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default JourneySection;
