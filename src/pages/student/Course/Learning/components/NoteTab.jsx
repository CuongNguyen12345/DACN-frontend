import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Trash2, Clock } from "lucide-react";

// Mock notification
const toast = (message) => alert(message); // Replace with Sonner or Toast later

const NoteTab = ({ lessonId }) => {
    const [note, setNote] = useState("");
    const [savedNotes, setSavedNotes] = useState([
        { id: 1, content: "Đoạn 05:30: Công thức tính nhanh đạo hàm.", time: "05:30" }
    ]);

    const handleSave = () => {
        if (!note.trim()) return;
        const newNote = {
            id: Date.now(),
            content: note,
            time: "Now" // Mock timestamp relative to video
        };
        setSavedNotes([...savedNotes, newNote]);
        setNote("");
        toast("Đã lưu ghi chú!");
    };

    const handleDelete = (id) => {
        setSavedNotes(savedNotes.filter(n => n.id !== id));
    };

    return (
        <div className="flex flex-col h-full space-y-4 p-4">
            <div className="space-y-2">
                <Textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú lại những ý quan trọng..."
                    className="resize-none"
                />
                <Button onClick={handleSave} className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" /> Lưu Note
                </Button>
            </div>

            <div className="space-y-2">
                <h4 className="font-semibold text-lg">Ghi chú đã lưu</h4>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                    {savedNotes.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm py-4">Chưa có ghi chú nào.</p>
                    ) : (
                        <div className="space-y-3">
                            {savedNotes.map((item) => (
                                <div key={item.id} className="flex items-start justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="gap-1">
                                            <Clock className="h-3 w-3" /> {item.time}
                                        </Badge>
                                        <p className="text-sm mt-1">{item.content}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(item.id)}
                                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
};

export default NoteTab;
