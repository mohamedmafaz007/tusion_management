import { useEffect, useState } from "react";
import {
  getAttendance,
  getFees,
  getMaterials,
  getSettings,
  getStudents,
  seedIfNeeded,
  setAttendance,
  setFees,
  setMaterials,
  setSettings,
  setStudents,
} from "./storage";
import type {
  AppSettings,
  AttendanceRecord,
  FeePayment,
  Material,
  Student,
} from "./types";

function useSynced<T>(getter: () => T, setter: (v: T) => void, key: string) {
  const [state, setState] = useState<T>(getter);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key?.includes(key)) setState(getter());
    };
    window.addEventListener("tms:storage", handler);
    window.addEventListener("storage", () => setState(getter()));
    return () => window.removeEventListener("tms:storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const update = (v: T | ((p: T) => T)) => {
    const next = typeof v === "function" ? (v as (p: T) => T)(state) : v;
    setter(next);
    setState(next);
  };
  return [state, update] as const;
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    seedIfNeeded();
    setH(true);
  }, []);
  return h;
}

export const useStudents = () => useSynced<Student[]>(getStudents, setStudents, "students");
export const useAttendance = () =>
  useSynced<AttendanceRecord[]>(getAttendance, setAttendance, "attendance");
export const useFees = () => useSynced<FeePayment[]>(getFees, setFees, "fees");
export const useMaterials = () => useSynced<Material[]>(getMaterials, setMaterials, "materials");
export const useSettings = () => useSynced<AppSettings>(getSettings, setSettings, "settings");
