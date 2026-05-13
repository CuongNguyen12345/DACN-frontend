const STORAGE_PREFIX = "edu4all:lesson-notes:";

const getBrowserStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
};

export const getLessonNoteStorageKey = (lessonId) => `${STORAGE_PREFIX}${lessonId}`;

export const formatNoteTime = (seconds) => {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const paddedMins = String(mins).padStart(2, "0");
  const paddedSecs = String(secs).padStart(2, "0");

  if (hrs > 0) return `${hrs}:${paddedMins}:${paddedSecs}`;
  return `${paddedMins}:${paddedSecs}`;
};

export const readLessonNotes = (lessonId, storage = getBrowserStorage()) => {
  if (!lessonId || !storage) return [];

  try {
    const storedValue = storage.getItem(getLessonNoteStorageKey(lessonId));
    if (!storedValue) return [];

    const parsedNotes = JSON.parse(storedValue);
    if (!Array.isArray(parsedNotes)) return [];

    return parsedNotes.filter((note) => note && note.id && note.content);
  } catch {
    return [];
  }
};

export const writeLessonNotes = (lessonId, notes, storage = getBrowserStorage()) => {
  if (!lessonId || !storage) return [];

  const nextNotes = Array.isArray(notes) ? notes : [];
  storage.setItem(getLessonNoteStorageKey(lessonId), JSON.stringify(nextNotes));
  return nextNotes;
};

export const addLessonNote = (
  lessonId,
  content,
  currentTimeSeconds = 0,
  storage = getBrowserStorage(),
  createId = () => Date.now(),
) => {
  const trimmedContent = content.trim();
  if (!lessonId || !trimmedContent) return null;

  const newNote = {
    id: createId(),
    lessonId,
    content: trimmedContent,
    time: formatNoteTime(currentTimeSeconds),
  };

  writeLessonNotes(lessonId, [...readLessonNotes(lessonId, storage), newNote], storage);
  return newNote;
};

export const deleteLessonNote = (lessonId, noteId, storage = getBrowserStorage()) => {
  const remainingNotes = readLessonNotes(lessonId, storage).filter((note) => note.id !== noteId);
  return writeLessonNotes(lessonId, remainingNotes, storage);
};
