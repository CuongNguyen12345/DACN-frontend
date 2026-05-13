import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  normalizeExamSecuritySettings,
  shouldBlockExamShortcut,
} from "@/lib/examSecuritySettings";

export const useExamSecurityGuard = ({
  settings,
  enabled = true,
  onTabSwitch,
} = {}) => {
  const lastWarningAtRef = useRef(0);

  const warn = useCallback((message) => {
    const now = Date.now();
    if (now - lastWarningAtRef.current < 1500) return;
    lastWarningAtRef.current = now;
    toast.warning(message);
  }, []);

  useEffect(() => {
    const normalizedSettings = normalizeExamSecuritySettings(settings);
    if (!enabled || !normalizedSettings.preventCopy) return undefined;

    const handleBlockedAction = (event) => {
      event.preventDefault();
      warn("Tính năng sao chép/dán đã bị vô hiệu hóa trong lúc làm bài.");
    };

    const handleKeyDown = (event) => {
      if (!shouldBlockExamShortcut(normalizedSettings, event)) return;
      handleBlockedAction(event);
    };

    ["copy", "cut", "paste", "contextmenu"].forEach((eventName) => {
      document.addEventListener(eventName, handleBlockedAction);
    });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      ["copy", "cut", "paste", "contextmenu"].forEach((eventName) => {
        document.removeEventListener(eventName, handleBlockedAction);
      });
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, settings, warn]);

  useEffect(() => {
    const normalizedSettings = normalizeExamSecuritySettings(settings);
    if (!enabled || !normalizedSettings.preventTabSwitch) return undefined;

    const handleLeaveExamScreen = () => {
      onTabSwitch?.();
      warn("Cảnh báo: học viên vừa rời khỏi màn hình làm bài.");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleLeaveExamScreen();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleLeaveExamScreen);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleLeaveExamScreen);
    };
  }, [enabled, onTabSwitch, settings, warn]);
};
