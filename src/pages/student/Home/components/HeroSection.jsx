import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const heroContent = {
    titleLine1: "Chinh Phục Kiến Thức",
    titleLine2: "Chủ Động Tương Lai",
    description:
        "Nền tảng tự học toàn diện cho học sinh cấp 3. Lộ trình cá nhân hóa, video bài giảng chất lượng và kho đề thi thử miễn phí.",
    primaryButton: {
        text: "Bắt đầu học",
        to: "/course",
    },
    secondaryButton: {
        text: "Test năng lực",
        to: "/assessment",
    },
    image:
        "https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?w=826&t=st=1700000000~exp=1700000000~hmac=abcdef",
};

const HeroSection = () => {
    return (
        <div className="py-12 md:py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="flex-1 space-y-8 text-center md:text-left max-w-2xl">
                    <h1 className="font-montserrat text-2xl sm:text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6 leading-tight">
                        <span className="whitespace-nowrap">{heroContent.titleLine1}</span>
                        <br />
                        <span className="text-secondary whitespace-nowrap md:ml-0 ml-2">
                            {heroContent.titleLine2}
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                        {heroContent.description}
                    </p>

                    <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
                        <Button
                            asChild
                            className="cursor-pointer bg-[#FF6B50] hover:bg-[#e85a40] text-white font-bold px-8 py-6 rounded-lg text-lg shadow-lg shadow-orange-200"
                        >
                            <Link to={heroContent.primaryButton.to}>
                                {heroContent.primaryButton.text}
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="cursor-pointer border-[#0F4C81] text-[#0F4C81] hover:bg-blue-50 hover:text-[#0F4C81] font-bold px-8 py-6 rounded-lg text-lg"
                        >
                            <Link to={heroContent.secondaryButton.to}>
                                {heroContent.secondaryButton.text}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center md:justify-end">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-red-100 rounded-full blur-3xl opacity-50 z-0"></div>
                        <img
                            src={heroContent.image}
                            alt="Students Learning"
                            className="relative z-10 max-w-full max-w-md md:max-w-lg object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;