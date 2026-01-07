import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Goals = () => {
    // Mock Goals
    const [goals, setGoals] = useState([
        { id: 1, title: "Mục tiêu thi THPT QG", target: 27, current: 24, unit: "điểm" },
        { id: 2, title: "Mục tiêu IELTS", target: 7.5, current: 6.0, unit: "band" }
    ]);
    const [open, setOpen] = useState(false);

    return (
        <div className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Mục tiêu học tập</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground rounded-full hover:bg-muted">
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add Goal</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Thêm mục tiêu mới</DialogTitle>
                            <DialogDescription>
                                Đặt mục tiêu để phấn đấu nỗ lực hơn mỗi ngày.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Tên
                                </Label>
                                <Input id="name" placeholder="Ví dụ: Thi cuối kỳ" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="target" className="text-right">
                                    Mục tiêu
                                </Label>
                                <Input id="target" placeholder="10" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={() => setOpen(false)}>Lưu mục tiêu</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
                <div className="space-y-6">
                    {goals.map((item) => {
                        const percent = (item.current / item.target) * 100;
                        return (
                            <div key={item.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">{item.title}</span>
                                    <span className="text-muted-foreground text-xs">
                                        {item.current} / {item.target} {item.unit}
                                    </span>
                                </div>
                                <Progress value={percent} className="h-2" />
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </div>
    );
};

export default Goals;
