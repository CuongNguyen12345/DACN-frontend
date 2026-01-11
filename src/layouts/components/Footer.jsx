import { FaTiktok, FaFacebookF, FaYoutube } from "react-icons/fa";
const Footer = () => {
    return (
        <footer className="bg-[#103F64] pt-12 pb-8">
            <div className="container mx-auto px-4 text-center">

                <h2 className="text-white text-2xl font-bold mb-4">Edu<span className="text-[#FF6B50]">4All</span></h2>

                <p className="text-white/90 text-sm mb-6">
                    Đồng hành cùng học sinh Việt Nam trên con đường tri thức.
                </p>

                {/* Social Icons */}
                <div className="flex justify-center gap-6 mb-8">
                    <a href="#" className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
                        <FaFacebookF className='text-[#103F64] text-2xl' />
                    </a>
                    <a href="#" className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
                        <FaYoutube className='text-[#103F64] text-2xl' />
                    </a>
                    <a href="#" className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors">
                        <FaTiktok className='text-[#103F64] text-2xl' />
                    </a>
                </div>

                {/* Bottom Footer */}
                <div className="">
                    <p className="text-white/60 text-xs">© {new Date().getFullYear()} Edu4All. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;