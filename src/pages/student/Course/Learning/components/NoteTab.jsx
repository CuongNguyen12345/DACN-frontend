import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Trash2, Clock } from "lucide-react";
import {
    addLessonNote,
    deleteLessonNote,
    readLessonNotes,
} from "./noteStorage";

const NoteTab = ({ lessonId, getCurrentTime = () => 0 }) => {
    const [note, setNote] = useState("");
    const [, setNotesVersion] = useState(0);
    const savedNotes = readLessonNotes(lessonId);

    const handleSave = () => {
        const currentTime = typeof getCurrentTime === "function" ? getCurrentTime() : 0;
        const newNote = addLessonNote(lessonId, note, currentTime);

        if (!newNote) return;

        setNotesVersion((version) => version + 1);
        setNote("");
        toast.success("Đã lưu ghi chú!");
    };

    const handleDelete = (id) => {
        deleteLessonNote(lessonId, id);
        setNotesVersion((version) => version + 1);
    };

    return (
        <div className="flex h-full flex-col space-y-4 p-4">
            <div className="space-y-2">
                <Textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú lại những ý quan trọng..."
                    className="resize-none"
                />
                <Button
                    onClick={handleSave}
                    disabled={!note.trim()}
                    className="w-full sm:w-auto"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Lưu Note
                </Button>
            </div>

            <div className="space-y-2">
                <h4 className="text-lg font-semibold">Ghi chú đã lưu</h4>

                <ScrollArea className="h-[300px] rounded-md border p-4">
                    {savedNotes.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            Chưa có ghi chú nào.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {savedNotes.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
                                >
                                    <div className="min-w-0 space-y-1">
                                        <Badge variant="secondary" className="gap-1">
                                            <Clock className="h-3 w-3" />
                                            {item.time}
                                        </Badge>
                                        <p className="mt-1 whitespace-pre-wrap break-words text-sm">
                                            {item.content}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Xóa ghi chú"
                                        onClick={() => handleDelete(item.id)}
                                        className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive/90"
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
