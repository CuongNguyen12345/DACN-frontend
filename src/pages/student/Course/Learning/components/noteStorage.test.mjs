import test from "node:test";
import assert from "node:assert/strict";

import {
  addLessonNote,
  deleteLessonNote,
  formatNoteTime,
  readLessonNotes,
} from "./noteStorage.js";

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
};

test("formats note timestamps from video seconds", () => {
  assert.equal(formatNoteTime(330), "05:30");
  assert.equal(formatNoteTime(3661), "1:01:01");
  assert.equal(formatNoteTime(-5), "00:00");
});

test("stores notes separately for each lesson", () => {
  const storage = createMemoryStorage();

  const note = addLessonNote("lesson-1", "  Important idea  ", 330, storage, () => 1001);

  assert.deepEqual(note, {
    id: 1001,
    lessonId: "lesson-1",
    content: "Important idea",
    time: "05:30",
  });
  assert.deepEqual(readLessonNotes("lesson-1", storage), [note]);
  assert.deepEqual(readLessonNotes("lesson-2", storage), []);
});

test("does not store blank notes", () => {
  const storage = createMemoryStorage();

  const note = addLessonNote("lesson-1", "   ", 12, storage, () => 1002);

  assert.equal(note, null);
  assert.deepEqual(readLessonNotes("lesson-1", storage), []);
});

test("deletes only the selected note", () => {
  const storage = createMemoryStorage();
  const first = addLessonNote("lesson-1", "First", 5, storage, () => 1);
  const second = addLessonNote("lesson-1", "Second", 10, storage, () => 2);

  const remaining = deleteLessonNote("lesson-1", first.id, storage);

  assert.deepEqual(remaining, [second]);
  assert.deepEqual(readLessonNotes("lesson-1", storage), [second]);
});

test("returns an empty list when stored notes are invalid", () => {
  const storage = createMemoryStorage();
  storage.setItem("edu4all:lesson-notes:lesson-1", "{bad json");

  assert.deepEqual(readLessonNotes("lesson-1", storage), []);
});
