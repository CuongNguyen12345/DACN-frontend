<<<<<<< HEAD

import { Calculator, FlaskConical, Beaker, Languages } from "lucide-react";

const FeaturedSubjects = () => {
    const subjects = [
        {
            id: 1,
            title: "Toán Học",
            description: "Đại số, Hình học, Giải tích",
            icon: Calculator,
            color: "bg-blue-50 text-blue-600 border-blue-100",
            iconBg: "bg-blue-500 text-white"
        },
        {
            id: 2,
            title: "Vật Lý",
            description: "Cơ học, Điện học, Quang học",
            icon: FlaskConical,
            color: "bg-yellow-50 text-yellow-600 border-yellow-100",
            iconBg: "bg-yellow-400 text-white"
        },
        {
            id: 3,
            title: "Hóa Học",
            description: "Hóa vô cơ, Hóa hữu cơ",
            icon: Beaker,
            color: "bg-green-50 text-green-600 border-green-100",
            iconBg: "bg-green-500 text-white"
        },
        {
            id: 4,
            title: "Tiếng Anh",
            description: "Ngữ pháp, Từ vựng, Đọc hiểu",
            icon: Languages,
            color: "bg-red-50 text-red-600 border-red-100",
            iconBg: "bg-red-400 text-white"
        }
    ];

=======
import { Calculator, FlaskConical, Beaker, Languages } from "lucide-react";
import { Link } from "react-router-dom";

const subjects = [
    {
        id: 1,
        title: "Toán Học",
        description: "Đại số, Hình học, Giải tích",
        icon: Calculator,
        color: "bg-blue-50 text-blue-600 border-blue-100",
        iconBg: "bg-blue-500 text-white",
        to: "/course?subject=Toán",
    }, {
        id: 2,
        title: "Vật Lý",
        description: "Cơ học, Điện học, Quang học",
        icon: FlaskConical,
        color: "bg-yellow-50 text-yellow-600 border-yellow-100",
        iconBg: "bg-yellow-400 text-white",
        to: "/course?subject=Lý",
    }, {
        id: 3,
        title: "Hóa Học",
        description: "Hóa vô cơ, Hóa hữu cơ",
        icon: Beaker,
        color: "bg-green-50 text-green-600 border-green-100",
        iconBg: "bg-green-500 text-white",
        to: "/course?subject=Hóa",
    }, {
        id: 4,
        title: "Tiếng Anh",
        description: "Ngữ pháp, Từ vựng, Đọc hiểu",
        icon: Languages,
        color: "bg-red-50 text-red-600 border-red-100",
        iconBg: "bg-red-400 text-white",
        to: "/course?subject=Tiếng Anh",
    },
];

const FeaturedSubjects = () => {
>>>>>>> nhanh_cua_Hao
    return (
        <div className="py-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                    Các môn học nổi bật
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<<<<<<< HEAD
                {subjects.map((subject) => (
                    <div key={subject.id} className={`p-6 rounded-2xl border ${subject.color} flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer`}>
                        <div className={`p-4 rounded-xl mb-4 ${subject.iconBg}`}>
                            <subject.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{subject.title}</h3>
                        <p className="text-gray-500 text-xs">
                            {subject.description}
                        </p>
                    </div>
                ))}
=======
                {subjects.map((subject) => {
                    const Icon = subject.icon;

                    return (
                        <Link
                            key={subject.id}
                            to={subject.to}
                            className={`p-6 rounded-2xl border ${subject.color} flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer`}
                        >
                            <div className={`p-4 rounded-xl mb-4 ${subject.iconBg}`}>
                                <Icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {subject.title}
                            </h3>
                            <p className="text-gray-500 text-xs">{subject.description}</p>
                        </Link>
                    );
                })}
>>>>>>> nhanh_cua_Hao
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default FeaturedSubjects;
=======
export default FeaturedSubjects;
>>>>>>> nhanh_cua_Hao
