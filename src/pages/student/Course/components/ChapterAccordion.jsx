import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LessonCard from "./LessonCard";
import { Badge } from "@/components/ui/badge";

const ChapterAccordion = ({ chapters, onLessonSelect }) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Không tìm thấy bài học nào phù hợp.
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      defaultValue={chapters.map((c) => `item-${c.id}`)}
      className="w-full space-y-4"
    >
      {chapters.map((chapter) => (
        <AccordionItem
          key={chapter.id}
          value={`item-${chapter.id}`}
          className="border rounded-lg bg-white overflow-hidden shadow-sm px-4"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center text-left">
              <span className="font-bold text-gray-700">
                {chapter.chapterName}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({chapter.lessons?.length || 0} bài học)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
              {chapter.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onClick={onLessonSelect}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;
