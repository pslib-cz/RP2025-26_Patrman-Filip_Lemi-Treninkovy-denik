import { useState } from "react";
import { Skill, SavedRound } from "@/types/training";
import { saveRound, deleteSavedRound } from "@/services/log.service";
import toast from "react-hot-toast";

export function usePresetModal(
  currentRoundSkills: Skill[],
  setSavedRounds: React.Dispatch<React.SetStateAction<SavedRound[]>>,
) {
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [isRoutineForPreset, setIsRoutineForPreset] = useState(false);
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  const handleSavePreset = async () => {
    if (!newPresetName.trim() || currentRoundSkills.length === 0) return;
    setIsSavingPreset(true);

    const figString = currentRoundSkills.map((s) => s.fig_code).join(" ");
    const totalDiff = currentRoundSkills.reduce((acc, s) => acc + s.difficulty, 0);

    const result = await saveRound(newPresetName, figString, totalDiff, isRoutineForPreset);

    if (result.success && result.data) {
      setSavedRounds((prev) => [result.data as SavedRound, ...prev]);
      setShowSavePresetModal(false);
      setNewPresetName("");
      setIsRoutineForPreset(false);
      toast.success("Preset saved!");
    } else {
      toast.error("Failed to save preset");
    }
    setIsSavingPreset(false);
  };

  const handleDeletePreset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await deleteSavedRound(id);
    if (result.success) {
      setSavedRounds((prev) => prev.filter((r) => r.id !== id));
      toast.success("Preset deleted");
    }
  };

  return {
    showSavePresetModal,
    setShowSavePresetModal,
    newPresetName,
    setNewPresetName,
    isRoutineForPreset,
    setIsRoutineForPreset,
    isSavingPreset,
    handleSavePreset,
    handleDeletePreset,
  };
}
