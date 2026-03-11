import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InstitutionType } from "@/types/database";

interface InstitutionState {
  institutionType: InstitutionType | null;
  institutionName: string;
  setInstitution: (type: InstitutionType, name: string) => void;
  clearInstitution: () => void;
}

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set) => ({
      institutionType: null,
      institutionName: "",
      setInstitution: (type, name) =>
        set({ institutionType: type, institutionName: name }),
      clearInstitution: () =>
        set({ institutionType: null, institutionName: "" }),
    }),
    {
      name: "markinga-institution",
    }
  )
);
