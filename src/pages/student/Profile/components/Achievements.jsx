import { Trophy, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Achievements = () => {
    const badges = [
        {
            id: 1,
            name: "Thần đồng Toán học",
            icon: <Trophy className="h-6 w-6 text-yellow-600" />,
            desc: "Giải đúng 1000 câu Toán",
            date: "20/12/2025",
            bg: "bg-yellow-100",
        },
        {
            id: 2,
            name: "Chiến binh Bền bỉ",
            icon: <Zap className="h-6 w-6 text-blue-600" />,
            desc: "Học liên tục 30 ngày",
            date: "15/12/2025",
            bg: "bg-blue-100",
        },
        {
            id: 3,
            name: "Master Hình học",
            icon: <Star className="h-6 w-6 text-purple-600" />,
            desc: "Đạt điểm 10 chuyên đề Hình học",
            date: "10/11/2025",
            bg: "bg-purple-100",
        }
    ];

    return (
        <Card className="h-full shadow-sm">
            <CardHeader>
                <CardTitle>Bảng thành tích</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {badges.map((item) => (
                        <div key={item.id} className="flex items-start justify-between group p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex gap-4">
                                <Avatar className={`h-12 w-12 border-2 border-white shadow-sm flex items-center justify-center ${item.bg}`}>
                                    {item.icon}
                                </Avatar>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                {item.date}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Achievements;
