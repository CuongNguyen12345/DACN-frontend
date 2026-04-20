import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";

const LessonCard = ({ lesson, onClick }) => {
    return (
        <Card 
            className="hover:shadow-md transition-all cursor-pointer group border-gray-100"
            onClick={() => onClick(lesson)}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-2 py-0 text-[10px] font-bold">
                        {lesson.subjectBadge}
                    </Badge>
                </div>
                <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {lesson.lessonName}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <PlayCircle className="h-3 w-3 mr-1 text-primary" />
                    <span>Xem video bài giảng</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default LessonCard;
