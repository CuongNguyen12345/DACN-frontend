import React, { useState } from "react";
import { 
  Trophy, Medal, Crown, Search, 
  TrendingUp, Star, Filter, ArrowUp 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Leaderboard = () => {
  const [category, setCategory] = useState("all");

  // Mock Data: Danh sách top học sinh
  const topUsers = [
    { id: 1, name: "Nguyễn Văn A", score: 2850, level: 42, avatar: "", trend: "up", rank: 1 },
    { id: 2, name: "Trần Thị B", score: 2720, level: 40, avatar: "", trend: "same", rank: 2 },
    { id: 3, name: "Lê Văn C", score: 2680, level: 38, avatar: "", trend: "down", rank: 3 },
    { id: 4, name: "Phạm Minh D", score: 2450, level: 35, avatar: "", trend: "up", rank: 4 },
    { id: 5, name: "Hoàng An", score: 2300, level: 32, avatar: "", trend: "up", rank: 5 },
  ];

  // Hàm trả về màu sắc của Badge dựa trên Level
  // Bạn có thể tùy chỉnh mốc level ở đây (VD: level >= 40 thì cam, dưới 40 thì xanh)
  const getLevelColor = (level) => {
    if (level >= 40) {
      // Màu cam (bỏ hover bằng hover:bg-amber-100 hoặc hover:bg-transparent tùy thư viện, ở đây ép cứng class)
      return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none";
    }
    // Màu xanh lá
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-amber-100 rounded-2xl mb-2">
          <Trophy className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Bảng Xếp Hạng Cao Thủ
        </h2>
        <p className="text-slate-500">Vinh danh những học sinh có thành tích xuất sắc nhất tuần này</p>
      </div>

      {/* Top 3 Podium (Bục vinh quang) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10 pb-6">
        {/* Hạng 2 */}
        <div className="order-2 md:order-1 flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-20 w-20 border-4 border-slate-200 shadow-xl">
              <AvatarImage src={topUsers[1].avatar} />
              <AvatarFallback className="bg-slate-200 text-lg font-bold">2</AvatarFallback>
            </Avatar>
            <Medal className="absolute -bottom-2 -right-2 h-8 w-8 text-slate-400 fill-slate-400" />
          </div>
          <h4 className="font-bold text-slate-800">{topUsers[1].name}</h4>
          <p className="text-indigo-600 font-bold">{topUsers[1].score} XP</p>
        </div>

        {/* Hạng 1 */}
        <div className="order-1 md:order-2 flex flex-col items-center scale-110 mb-6 md:mb-12">
          <div className="relative mb-4">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <Crown className="h-10 w-10 text-amber-500 fill-amber-500 animate-bounce" />
            </div>
            <Avatar className="h-28 w-28 border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <AvatarImage src={topUsers[0].avatar} />
              <AvatarFallback className="bg-amber-100 text-2xl font-bold">1</AvatarFallback>
            </Avatar>
          </div>
          <h4 className="text-xl font-black text-slate-900">{topUsers[0].name}</h4>
          <Badge className="bg-amber-500 hover:bg-amber-500 text-white mb-1 border-none">Quán Quân</Badge>
          <p className="text-indigo-600 text-lg font-black">{topUsers[0].score} XP</p>
        </div>

        {/* Hạng 3 */}
        <div className="order-3 flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-20 w-20 border-4 border-orange-200 shadow-xl">
              <AvatarImage src={topUsers[2].avatar} />
              <AvatarFallback className="bg-orange-100 text-lg font-bold">3</AvatarFallback>
            </Avatar>
            <Medal className="absolute -bottom-2 -right-2 h-8 w-8 text-orange-400 fill-orange-400" />
          </div>
          <h4 className="font-bold text-slate-800">{topUsers[2].name}</h4>
          <p className="text-indigo-600 font-bold">{topUsers[2].score} XP</p>
        </div>
      </div>

      {/* Filter & List Section */}
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg font-bold">Thứ hạng chi tiết</CardTitle>
          <div className="flex gap-3">
            <Select defaultValue="week">
              <SelectTrigger className="w-[130px] rounded-full">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b">
                  <th className="px-6 py-4 font-bold">Hạng</th>
                  <th className="px-6 py-4 font-bold">Học sinh</th>
                  <th className="px-6 py-4 font-bold">Cấp độ</th>
                  <th className="px-6 py-4 font-bold text-right">Điểm XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${index < 3 ? 'text-indigo-600' : 'text-slate-500'}`}>
                        #{user.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-700 group-hover:text-indigo-600">{user.name}</span>
                        {user.trend === "up" && <ArrowUp className="h-3 w-3 text-emerald-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* ĐÃ SỬA Ở ĐÂY: Dùng hàm getLevelColor để quyết định màu và chặn hiệu ứng hover */}
                      <Badge className={`font-medium ${getLevelColor(user.level)}`}>
                        Level {user.level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-slate-900">{user.score.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;