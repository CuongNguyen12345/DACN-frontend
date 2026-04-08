import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FilterSection = ({ 
    searchTerm, 
    setSearchTerm, 
    selectedGrade, 
    setSelectedGrade, 
    selectedSubject, 
    setSelectedSubject, 
    onReset 
}) => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Ô tìm kiếm */}
                <div className="md:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm bài giảng, giáo viên..."
                        className="pl-10 bg-white border-gray-200 rounded-lg h-11 focus:ring-primary/20"
                    />
                </div>

                {/* Chọn Môn học */}
                <div className="md:col-span-3">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="bg-white border-gray-200 rounded-lg h-11">
                            <SelectValue placeholder="Tất cả môn" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả môn</SelectItem>
                            <SelectItem value="Toán">Toán Học</SelectItem>
                            <SelectItem value="Lý">Vật Lý</SelectItem>
                            <SelectItem value="Hóa">Hóa Học</SelectItem>
                            <SelectItem value="Anh">Tiếng Anh</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Chọn Khối lớp */}
                <div className="md:col-span-2">
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-white border-gray-200 rounded-lg h-11">
                            <SelectValue placeholder="Tất cả lớp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả lớp</SelectItem>
                            <SelectItem value="10">Lớp 10</SelectItem>
                            <SelectItem value="11">Lớp 11</SelectItem>
                            <SelectItem value="12">Lớp 12</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Nút Xóa lọc */}
                <div className="md:col-span-2">
                    <Button 
                        variant="outline" 
                        onClick={onReset} 
                        className="w-full bg-white border-gray-200 rounded-lg h-11 font-medium hover:bg-gray-50"
                    >
                        Xóa lọc
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
