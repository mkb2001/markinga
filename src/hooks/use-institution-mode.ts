import { useInstitutionStore } from "@/stores/institution-store";

export function useInstitutionMode() {
  const { institutionType, institutionName, setInstitution, clearInstitution } =
    useInstitutionStore();

  const isPrimary = institutionType === "PRIMARY_SECONDARY";
  const isUniversity = institutionType === "UNIVERSITY";
  const isOnboarded = institutionType !== null;

  return {
    institutionType,
    institutionName,
    isPrimary,
    isUniversity,
    isOnboarded,
    setInstitution,
    clearInstitution,
  };
}
