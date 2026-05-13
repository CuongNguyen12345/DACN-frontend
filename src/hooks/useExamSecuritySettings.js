import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  loadExamSecuritySettings,
  readLocalExamSecuritySettings,
} from "@/lib/examSecuritySettings";

export const useExamSecuritySettings = () => {
  const [settings, setSettings] = useState(() => readLocalExamSecuritySettings());

  useEffect(() => {
    let cancelled = false;

    loadExamSecuritySettings(api).then((loadedSettings) => {
      if (!cancelled) setSettings(loadedSettings);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
};
