"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import SmartKeyboard from "@/components/SmartKeyboard";
import {
  Skill,
  Round,
  DbSkill,
  UserSkills,
  SavedRound,
} from "@/types/training";
import { CurrentRoundBoard } from "@/components/CurrentRoundBoard";
import { CopyCheckButton } from "@/components/copycheck-button";
import { LoggedRoundsList } from "@/components/LoggedRoundsList";
import { finishTrainingSession } from "@/services/log.service";
import { usePresetModal } from "@/app/hooks/usePresetModal";
import { Zap, Save, X, Star, ChevronDown } from "lucide-react";
import { FinishSessionScreen } from "@/components/FinishSessionScreen";
import { TofBanner } from "@/components/TofBanner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import LogGuide from "@/components/LogGuide";

interface Props {
  dictionary: DbSkill[];
  userSkills: UserSkills[];
  skillScores: Record<string, number>;
  initialSavedRounds: SavedRound[];
}

function parseSkillInput(input: string) {
  let baseCode = input;
  let direction: string | null = null;
  if (input.startsWith("F") || input.startsWith("B")) {
    direction = input.slice(0, 1);
    baseCode = input.slice(1);
  }
  return { baseCode, direction };
}

function resolveSkill(
  code: string,
  dictionary: DbSkill[],
  userSkills?: UserSkills[],
): { skill: DbSkill | null; error?: string } {
  const { baseCode, direction } = parseSkillInput(code);
  const matches = dictionary.filter((s) => s.code === baseCode);

  if (!matches.length) return { skill: null, error: "Skill code not found in dictionary" };

  if (direction) {
    const exact = matches.find((s) => s.direction === direction);
    if (!exact) return { skill: null, error: `Skill with direction ${direction} not found` };
    return { skill: exact };
  }

  if (matches.length > 1 && userSkills) {
    const mastered = matches.filter((ms) =>
      userSkills.some(
        (us) =>
          us.skill_id === ms.id &&
          (us.status === "mastered" || us.status === "learning"),
      ),
    );
    if (mastered.length === 1) return { skill: mastered[0] };
  }

  return { skill: matches[0] };
}

const sumDifficulty = (skills: Skill[]) =>
  skills.reduce((acc, s) => acc + s.difficulty, 0);

export default function LogClient({
  dictionary,
  userSkills,
  skillScores,
  initialSavedRounds,
}: Props) {
  const [showPresets, setShowPresets] = useState(false);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentRoundSkills, setCurrentRoundSkills] = useLocalStorage<Skill[]>(
    "lemi_current_skills",
    [],
  );
  const [rounds, setRounds] = useLocalStorage<Round[]>("lemi_rounds", []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [showTofInput, setShowTofInput] = useState(false);
  const [tofValue, setTofValue] = useState("");
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [skillSuggestion, setSkillSuggestion] = useState<string>("");
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>(initialSavedRounds);
  const [isMobile, setIsMobile] = useState(
    () => typeof window === "undefined" || window.matchMedia("(max-width: 767px)").matches,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isMobile) inputRef.current?.focus();
  }, [isMobile]);

  const {
    showSavePresetModal,
    setShowSavePresetModal,
    newPresetName,
    setNewPresetName,
    isRoutineForPreset,
    setIsRoutineForPreset,
    isSavingPreset,
    handleSavePreset,
    handleDeletePreset,
  } = usePresetModal(currentRoundSkills, setSavedRounds);

  const userSkillCodes = useMemo(() => {
    return userSkills
      .map((us) => {
        const found = dictionary.find((d) => d.id === us.skill_id);
        if (!found) return null;
        const score = skillScores[found.code] || 0;
        return { code: found.code, direction: found.direction, score: score };
      })
      .filter(
        (item): item is { code: string; direction: string; score: number } =>
          item !== null,
      )
      .sort((a, b) => b.score - a.score);
  }, [dictionary, userSkills, skillScores]);

  const computeSuggestion = (value: string) => {
    if (!value.length) { setSkillSuggestion(""); return; }
    const { baseCode, direction } = parseSkillInput(value);
    if (baseCode.length > 0) {
      const match = userSkillCodes.find(
        (item) =>
          item.code.startsWith(baseCode) &&
          (!direction || item.direction === direction),
      );
      setSkillSuggestion(match ? match.code.substring(baseCode.length) : "");
    } else {
      setSkillSuggestion("");
    }
  };

  const addNewSkill = (inputCode: string) => {
    const { skill, error } = resolveSkill(inputCode, dictionary, userSkills);
    if (error) { setErrorMsg(error); return; }
    if (!skill) return;

    setCurrentRoundSkills((prev) => [
      ...prev,
      {
        id: uuidv4(),
        dictionary_id: skill.id,
        fig_code: (skill.direction || "") + skill.code,
        difficulty: skill.difficulty_value,
      },
    ]);
    setCurrentInput("");
    setSkillSuggestion("");
  };

  const confirmTof = () => {
    const tofNum = parseFloat(tofValue);
    setCurrentRoundSkills((prev) => [
      ...prev,
      { id: uuidv4(), fig_code: "-", difficulty: 0, tof: tofNum },
    ]);
    setShowTofInput(false);
    setTofValue("");
  };

  const handleTofKey = (key: string) => {
    if (key === "SPACE") {
      confirmTof();
    } else if (key === "BACKSPACE") {
      setTofValue((prev) => prev.slice(0, -1));
    } else if (!Number.isNaN(Number(key)) || key === ".") {
      setTofValue((prev) => prev + key);
    }
  };

  const handleSkillKey = (key: string) => {
    if (key === "SPACE") {
      if (currentInput.trim() === "") return;
      if (currentInput === "-" && currentRoundSkills.length === 0) {
        setShowTofInput(true);
        setTofValue("");
        setCurrentInput("");
        return;
      }
      addNewSkill(skillSuggestion ? currentInput + skillSuggestion : currentInput);
    } else if (key === "BACKSPACE") {
      setCurrentInput((prev) => {
        const next = prev.slice(0, -1);
        computeSuggestion(next);
        return next;
      });
    } else if (["2x", "3x", "4x", "5x"].includes(key)) {
      const multiplier = Number.parseInt(key[0]);
      setCurrentRoundSkills((prevSkills) => {
        if (prevSkills.length === 0) return prevSkills;
        const copiesToAdd: Skill[] = [];
        for (let i = 0; i < multiplier - 1; i++) {
          copiesToAdd.push(...prevSkills.map((skill) => ({ ...skill, id: uuidv4() })));
        }
        return [...prevSkills, ...copiesToAdd];
      });
    } else {
      const newInput = currentInput + key;
      setCurrentInput(newInput);
      computeSuggestion(newInput);
    }
  };

  const handleKeyPress = (key: string) => {
    setErrorMsg(null);
    if (showTofInput) return handleTofKey(key);
    handleSkillKey(key);
  };

  const handleDesktopInputChange = (value: string) => {
    setErrorMsg(null);
    setCurrentInput(value);
    computeSuggestion(value);
  };

  const handleDesktopKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleKeyPress("SPACE");
    }
  };

  const handleConfirmRound = (roundData: Partial<Round>) => {
    if (currentRoundSkills.length === 0) return;

    if (editingRoundId) {
      setRounds((prev) =>
        prev.map((round) =>
          round.id === editingRoundId
            ? {
                ...round,
                skills: currentRoundSkills,
                total_difficulty: sumDifficulty(currentRoundSkills),
                is_routine: roundData.is_routine,
                routine_type: roundData.routine_type,
                tof: roundData.tof,
              }
            : round,
        ),
      );
      setEditingRoundId(null);
    } else {
      setRounds((prev) => [
        ...prev,
        {
          id: uuidv4(),
          skills: currentRoundSkills,
          total_difficulty: sumDifficulty(currentRoundSkills),
          is_routine: roundData.is_routine,
          routine_type: roundData.routine_type,
          tof: roundData.tof,
        },
      ]);
    }

    setCurrentRoundSkills([]);
    setCurrentInput("");
  };

  const handleEditRound = (roundId: string) => {
    const roundToEdit = rounds.find((r) => r.id === roundId);
    if (roundToEdit) {
      setEditingRoundId(roundId);
      setCurrentRoundSkills([...roundToEdit.skills]);
    }
  };

  const handleDeleteRound = (roundId: string) => {
    setRounds((prev) => prev.filter((round) => round.id !== roundId));
  };

  const handleDuplicateRound = () => {
    if (rounds.length === 0) return;
    const lastRound = rounds.at(-1);
    if (!lastRound) return;
    setCurrentRoundSkills((prev) => [
      ...prev,
      ...lastRound.skills.map((skill) => ({ ...skill, id: uuidv4() })),
    ]);
  };

  const applyPreset = (preset: SavedRound) => {
    const newSkills: Skill[] = [];
    const missingCodes: string[] = [];

    for (const code of preset.fig_string.split(" ")) {
      if (code === "-") continue;
      const { skill } = resolveSkill(code, dictionary);
      if (skill) {
        newSkills.push({
          id: uuidv4(),
          dictionary_id: skill.id,
          fig_code: (skill.direction || "") + skill.code,
          difficulty: skill.difficulty_value,
        });
      } else {
        missingCodes.push(code);
      }
    }

    if (newSkills.length > 0) {
      setCurrentRoundSkills((prev) => [...prev, ...newSkills]);
      toast.success(`Applied ${preset.name}`);
    }
    if (missingCodes.length > 0) {
      toast.error(`Could not find: ${missingCodes.join(", ")}`);
    }
    setShowPresets(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    setCurrentRoundSkills((prev) => {
      const updatedSkills = prev.filter((skill) => skill.id !== skillId);
      if (updatedSkills.length === 0 && editingRoundId) {
        setRounds((r) => r.filter((round) => round.id !== editingRoundId));
        setEditingRoundId(null);
        setCurrentInput("");
      }
      return updatedSkills;
    });
  };

  const handleFinishSession = () => {
    if (rounds.length === 0) return;
    setIsFinishing(true);
  };

  const handleSaveSession = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const result = await finishTrainingSession(rounds, rating, notes);
    if (result.success) {
      setIsSaving(false);
      setRounds([]);
      setCurrentInput("");
      setRating(0);
      setNotes("");
      toast.success("Session saved successfully!", { duration: 4000 });
      router.push("/dashboard");
    } else {
      setIsSaving(false);
      toast.error("Failed to save session", { duration: 4000 });
    }
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-background">
        <FinishSessionScreen
          rating={rating}
          setRating={setRating}
          notes={notes}
          setNotes={setNotes}
          onSave={() => handleSaveSession()}
          onCancel={() => setIsFinishing(false)}
          onSaving={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="p-3 pt-4 md:max-w-5xl md:mx-auto md:p-6 md:pt-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8 md:items-start">

          <div className="flex flex-col gap-4 md:sticky md:top-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-bold text-2xl text-foreground">
                  New Training Session
                </h1>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <LogGuide />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-base font-bold text-foreground">Add Skill Code</p>
              <div className="flex gap-2">
                <div className="flex-1 relative overflow-hidden rounded-xl bg-card border border-border">
                  {currentInput.length > 0 && (
                    <div className="absolute inset-0 px-3 py-2 pointer-events-none font-mono text-base flex items-center">
                      <span className="text-transparent whitespace-pre select-none">
                        {currentInput}
                      </span>
                      <span className="text-muted-foreground animate-pulse whitespace-pre">
                        {skillSuggestion}
                      </span>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    readOnly={isMobile}
                    onChange={(e) => handleDesktopInputChange(e.target.value)}
                    onKeyDown={handleDesktopKeyDown}
                    placeholder="e.g. 41/ or 8-1/"
                    className="w-full px-3 py-2 bg-transparent font-mono text-base text-foreground placeholder:text-muted-foreground placeholder:text-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleKeyPress("SPACE")}
                  className="w-10 h-10 bg-primary text-white hover:bg-accent rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Zap className="w-4 h-4 fill-white" />
                </button>
              </div>
              {errorMsg && (
                <p className="text-sm font-semibold text-destructive animate-pulse">
                  {errorMsg}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground leading-relaxed md:hidden">
                Press{" "}
                <span className="font-bold text-foreground bg-muted px-1 rounded">Space</span>{" "}
                or{" "}
                <span className="font-bold text-foreground bg-muted px-1 rounded">Enter</span>{" "}
                to add.
                <br />
                Tip: Type{" "}
                <span className="text-primary font-mono font-bold">&ldquo;-&rdquo;</span>{" "}
                for time or{" "}
                <span className="text-primary font-mono font-bold ml-1">&ldquo;/&rdquo;</span>{" "}
                for straight jump.
              </p>
              <p className="hidden md:block text-[10px] text-muted-foreground leading-relaxed">
                Press{" "}
                <kbd className="font-bold text-foreground bg-muted px-1 rounded">Space</kbd>{" "}
                or{" "}
                <kbd className="font-bold text-foreground bg-muted px-1 rounded">Enter</kbd>{" "}
                to add. Prefix{" "}
                <span className="font-mono font-bold text-foreground">F</span>/{" "}
                <span className="font-mono font-bold text-foreground">B</span>{" "}
                for direction. Type{" "}
                <span className="text-primary font-mono font-bold">&ldquo;-&rdquo;</span>{" "}
                for time of flight.
              </p>
            </div>

            {showTofInput && (
              <TofBanner
                tofValue={tofValue}
                setTofValue={setTofValue}
                onSave={confirmTof}
                onClose={() => setShowTofInput(false)}
              />
            )}

            {currentRoundSkills.length > 0 && (
              <CurrentRoundBoard
                skills={currentRoundSkills}
                onConfirm={handleConfirmRound}
                isEditing={!!editingRoundId}
                onCancelEdit={() => {
                  setEditingRoundId(null);
                  setCurrentRoundSkills([]);
                }}
                onRemoveSkill={handleRemoveSkill}
              />
            )}

            {(savedRounds.length > 0 || currentRoundSkills.length > 0) && (
              <div className="relative">
                <button
                  onClick={() => setShowPresets((prev) => !prev)}
                  className="flex items-center justify-between w-full px-3 py-2 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold">
                      Presets
                      {savedRounds.length > 0 && (
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          ({savedRounds.length})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentRoundSkills.length > 0 && !editingRoundId && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSavePresetModal(true);
                        }}
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        showPresets ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`absolute top-full left-0 right-0 mt-2 z-50 flex flex-col gap-1.5 p-2 bg-card border border-border rounded-xl shadow-xl transition-all duration-200 ease-in-out ${
                    showPresets
                      ? "opacity-100 translate-y-0 pointer-events-auto visible"
                      : "opacity-0 -translate-y-2 pointer-events-none invisible"
                  }`}
                >
                  {savedRounds.length > 0 ? (
                    savedRounds.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className="flex items-center justify-between px-3 py-2.5 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          {preset.is_routine && (
                            <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                          )}
                          <span className="text-sm font-medium">{preset.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {preset.difficulty.toFixed(1)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-muted-foreground italic">
                        No presets yet. Save your current round to see it here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="md:hidden">
              <SmartKeyboard onKeyPress={handleKeyPress} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {rounds.length === 0 &&
              currentRoundSkills.length === 0 &&
              userSkills.length === 0 && (
                <div className="text-center p-8 bg-muted/20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center">
                  <Image
                    src="/Lemi-nobg.svg"
                    alt="Lemi Mascot"
                    width={100}
                    height={100}
                  />
                  <div className="space-y-2">
                    <p className="font-bold text-lg text-foreground">
                      Ready for your first jump?
                    </p>
                    <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                      Try typing a code like{" "}
                      <span className="font-mono font-bold text-primary">B4-o</span>{" "}
                      using the keyboard.
                    </p>
                    <p className="text-xs text-muted-foreground bg-muted/50 py-2 px-3 rounded-xl border border-border/50 md:hidden">
                      Confirm by pressing <span className="font-bold">Space</span>{" "}
                      or tapping the{" "}
                      <span className="text-primary font-bold">orange button</span>.
                    </p>
                    <p className="hidden md:block text-xs text-muted-foreground bg-muted/50 py-2 px-3 rounded-xl border border-border/50">
                      Confirm by pressing{" "}
                      <kbd className="font-bold">Space</kbd> or{" "}
                      <kbd className="font-bold">Enter</kbd>.
                    </p>
                  </div>
                </div>
              )}

            <CopyCheckButton
              onFinishSession={handleFinishSession}
              onDuplicateRound={handleDuplicateRound}
            />

            {rounds.length > 0 && (
              <LoggedRoundsList
                rounds={rounds}
                onDeleteRound={handleDeleteRound}
                onEditRound={handleEditRound}
                editingRoundId={editingRoundId}
              />
            )}
          </div>

        </div>
      </div>

      {showSavePresetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Save as Preset</h3>
              <p className="text-sm text-muted-foreground">
                Give this round a name to use it later.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold ml-1">Name</label>
                <input
                  autoFocus
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g. My Routine 2024"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <label className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isRoutineForPreset}
                    onChange={(e) => setIsRoutineForPreset(e.target.checked)}
                    className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Show on Profile</span>
                  <span className="text-[10px] text-muted-foreground">
                    Mark this as your official routine.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSavePresetModal(false)}
                className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-muted rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!newPresetName.trim() || isSavingPreset}
                className="flex-1 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {isSavingPreset ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
