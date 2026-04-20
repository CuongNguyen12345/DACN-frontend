import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

const VideoModal = ({ lesson, isOpen, onClose }) => {
    if (!lesson) return null;

    // Extract YouTube ID or use the full URL if it's already an ID
    const videoId = lesson.videoUrl;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
                <div className="relative pt-[56.25%]">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={lesson.lessonName}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="p-4 bg-white text-black">
                    <h3 className="text-lg font-bold">{lesson.lessonName}</h3>
                    <p className="text-sm text-gray-500">{lesson.subjectBadge}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VideoModal;
