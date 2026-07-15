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

import {
  getDbStudents, syncDbStudents,
  getDbAttendance, syncDbAttendance,
  getDbFees, syncDbFees,
  getDbMaterials, syncDbMaterials,
  getDbSettings, syncDbSettings
} from "./db";

function useSynced<T>(getter: () => T, setter: (v: T) => void, key: string) {
  const [state, setState] = useState<T>(getter);

  useEffect(() => {
    // 1. Fetch from cloud database on mount
    const fetchFromDb = async () => {
      try {
        let dbData: any = null;
        if (key === "students") {
          dbData = await getDbStudents();
        } else if (key === "attendance") {
          dbData = await getDbAttendance();
        } else if (key === "fees") {
          dbData = await getDbFees();
        } else if (key === "materials") {
          dbData = await getDbMaterials();
        } else if (key === "settings") {
          dbData = await getDbSettings();
        }

        if (dbData !== null && dbData !== undefined && (!Array.isArray(dbData) || dbData.length > 0)) {
          // Update local cache and state
          setter(dbData as T);
          setState(dbData as T);
        }
      } catch (err) {
        console.error(`Failed to load ${key} from cloud database:`, err);
      }
    };

    fetchFromDb();

    // 2. Storage event listener (sync tabs)
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key?.includes(key)) setState(getter());
    };
    window.addEventListener("tms:storage", handler);
    window.addEventListener("storage", () => setState(getter()));
    return () => window.removeEventListener("tms:storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = async (v: T | ((p: T) => T)) => {
    const next = typeof v === "function" ? (v as (p: T) => T)(state) : v;
    
    // Save to local cache first (instant UI update)
    setter(next);
    setState(next);

    // Save to cloud database in background
    try {
      if (key === "students") {
        await syncDbStudents(next as any[]);
      } else if (key === "attendance") {
        await syncDbAttendance(next as any[]);
      } else if (key === "fees") {
        await syncDbFees(next as any[]);
      } else if (key === "materials") {
        await syncDbMaterials(next as any[]);
      } else if (key === "settings") {
        await syncDbSettings(next);
      }
    } catch (err) {
      console.error(`Failed to sync ${key} to cloud database:`, err);
    }
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
