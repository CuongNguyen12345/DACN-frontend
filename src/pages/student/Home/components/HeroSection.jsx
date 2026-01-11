
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <div className="py-12 md:py-20">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
                {/* Left Content */}
                <div className="flex-1 space-y-8 text-center md:text-left max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F4C81] leading-tight">
                        Chinh Phục Kiến Thức <br />
                        <span className="text-[#0F4C81]">Chủ Động Tương Lai</span>
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                        Nền tảng tự học toàn diện cho học sinh cấp 3. Lộ trình cá nhân hóa, video bài giảng chất lượng và kho đề thi thử miễn phí.
                    </p>
                    <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
                        <Button className="cursor-pointer bg-[#FF6B50] hover:bg-[#e85a40] text-white font-bold px-8 py-6 rounded-lg text-lg shadow-lg shadow-orange-200">
                            Bắt đầu học
                        </Button>
                        <Button variant="outline" className="cursor-pointer border-[#0F4C81] text-[#0F4C81] hover:bg-blue-50 hover:text-[#0F4C81] font-bold px-8 py-6 rounded-lg text-lg">
                            Test năng lực
                        </Button>
                    </div>
                </div>

                {/* Right Content: Illustration */}
                <div className="flex-1 flex justify-center md:justify-end">
                    {/* Placeholder for Illustration - Using a relevant image from Unsplash or a colored placeholder */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-yellow-100 rounded-full blur-3xl opacity-50 z-0"></div>
                        <img
                            src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?w=826&t=st=1700000000~exp=1700000000~hmac=abcdef"
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
