
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <div className="py-12 md:py-20">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
                {/* Left Content */}
                <div className="flex-1 space-y-6 text-center md:text-left max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                        Chinh phục mọi kỳ thi, <br />
                        <span className="text-gray-900">vững bước tương lai.</span>
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                        Nền tảng tự học toàn diện dành cho học sinh cấp 3, giúp bạn nắm vững kiến thức và tự tin đạt điểm cao.
                    </p>
                    <div className="pt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg shadow-blue-200">
                            Khám phá ngay
                        </Button>
                    </div>
                </div>

                {/* Right Content: Illustration */}
                <div className="flex-1 flex justify-center md:justify-end">
                    {/* Placeholder for Illustration - Using a relevant image from Unsplash or a colored placeholder */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-yellow-100 rounded-full blur-3xl opacity-50 z-0"></div>
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/students-learning-online-2974917-2477348.png"
                            alt="Students Learning"
                            className="relative z-10 w-full max-w-md md:max-w-lg object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
