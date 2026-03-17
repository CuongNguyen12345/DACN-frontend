import { BookMarked, Layers, TrendingUp } from "lucide-react";

const benefits = [
    {
        id: 1,
        icon: BookMarked,
        title: "Lộ trình cá nhân hóa",
        description:
            "Xây dựng lộ trình học tập phù hợp với năng lực và mục tiêu của riêng bạn.",
        color: "text-blue-600 bg-blue-100",
    }, {
        id: 2,
        icon: Layers,
        title: "Nguồn tài liệu đa dạng",
        description:
            "Tiếp cận kho tài liệu phong phú, bài giảng chất lượng và bài tập đa dạng.",
        color: "text-blue-600 bg-blue-100",
    }, {
        id: 3,
        icon: TrendingUp,
        title: "Theo dõi tiến độ",
        description:
            "Dễ dàng theo dõi quá trình học tập và đánh giá sự tiến bộ qua từng ngày.",
        color: "text-blue-600 bg-blue-100",
    },
];

const BenefitsSection = () => {
    return (
        <div className="py-12 bg-gray-50/50 rounded-3xl my-12">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                    Lợi ích khi học cùng chúng tôi
                </h2>
                <p className="text-gray-500 text-sm max-w-lg mx-auto">
                    Những ưu điểm vượt trội giúp bạn đạt được kết quả tốt nhất trong học tập và các kỳ thi quan trọng.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-12">
                {benefits.map((benefit) => {
                    const Icon = benefit.icon;

                    return (
                        <div
                            key={benefit.id}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className={`p-4 rounded-xl mb-6 ${benefit.color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BenefitsSection;