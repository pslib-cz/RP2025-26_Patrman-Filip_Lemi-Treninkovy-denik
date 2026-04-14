"use client";

import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SmartKeyboard from "@/components/SmartKeyboard";
import { Skill, Round, DbSkill, UserSkills } from "@/types/training";
import { CurrentRoundBoard } from "@/components/CurrentRoundBoard";
import { CopyCheckButton } from "@/components/copycheck-button";
import { LoggedRoundsList } from "@/components/LoggedRoundsList";
import { finishTrainingSession } from "@/services/log.service";
import { Zap } from "lucide-react";
import { FinishSessionScreen } from "@/components/FinishSessionScreen";
import { TofBanner } from "@/components/TofBanner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  dictionary: DbSkill[];
  userSkills: UserSkills[];
}

export default function LogClient({ dictionary, userSkills }: Props) {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentRoundSkills, setCurrentRoundSkills] = useState<Skill[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
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
  const userSkillCodes = useMemo(() => {
    return userSkills
      .map((us) => {
        const found = dictionary.find((d) => d.id === us.skill_id);
        return found ? found.code : null;
      })
      .filter((code): code is string => code !== null);
  }, [dictionary, userSkills]);

  const handleKeyPress = (key: string) => {
    setErrorMsg(null);

    if (key === "SPACE") {
      if (currentInput.trim() === "") return;

      const isValidSkill = dictionary.some(
        (skill) => skill.code === currentInput,
      );
      if (skillSuggestion && !isValidSkill) {
        setCurrentInput(currentInput + skillSuggestion);
        setSkillSuggestion("");
        return;
      }
      let finalDiff = 0;

      if (currentInput === "-") {
        setShowTofInput(true);
        setTofValue("");
        setCurrentInput("");
        finalDiff = 0;
        return;
      }
        const foundSkill = dictionary.find(
          (skill) => skill.code === currentInput,
        );
        if (!foundSkill) {
          setErrorMsg("Skill code not found in dictionary");
          return;
        }
        finalDiff = foundSkill.difficulty_value;
      
      const newSkill: Skill = {
        id: uuidv4(),
        dictionary_id: foundSkill.id,
        fig_code: currentInput,
        difficulty: finalDiff,
      };

      setCurrentRoundSkills((prev) => [...prev, newSkill]);
      setCurrentInput("");
    } else if (key === "BACKSPACE") {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (["2x", "3x", "4x", "5x"].includes(key)) {
      const multiplier = Number.parseInt(key[0]);

      setCurrentRoundSkills((prevSkills) => {
        if (prevSkills.length === 0) return prevSkills;

        const copiesToAdd: Skill[] = [];

        for (let i = 0; i < multiplier - 1; i++) {
          const duplicatedSkills = prevSkills.map((skill) => ({
            ...skill,
            id: uuidv4(),
            dictionary_id: skill.dictionary_id,
          }));
          copiesToAdd.push(...duplicatedSkills);
        }
        return [...prevSkills, ...copiesToAdd];
      });
    } else {
      const newInput = currentInput + key;
      setCurrentInput(newInput);

      if (newInput.length > 0) {
        const match = userSkillCodes.find((code) => code.startsWith(newInput));
        if (match) {
          const reminder = match.substring(newInput.length);
          setSkillSuggestion(reminder);
        }
        else{
          setSkillSuggestion("")
        }
      }
    }
  };
  const handleConfirmRound = (roundData: Partial<Round>) => {
    if (currentRoundSkills.length === 0) return;

    if (editingRoundId) {
      setRounds((prev) =>
        prev.map((round) => {
          if (round.id === editingRoundId) {
            return {
              ...round,
              skills: currentRoundSkills,
              total_difficulty: currentRoundSkills.reduce(
                (acc, skill) => acc + skill.difficulty,
                0,
              ),
              is_routine: roundData.is_routine,
              routine_type: roundData.routine_type,
              tof: roundData.tof,
            };
          }
          return round;
        }),
      );
      setEditingRoundId(null);
    } else {
      const newRound: Round = {
        id: uuidv4(),
        skills: currentRoundSkills,
        total_difficulty: currentRoundSkills.reduce(
          (acc, skill) => acc + skill.difficulty,
          0,
        ),
        is_routine: roundData.is_routine,
        routine_type: roundData.routine_type,
        tof: roundData.tof,
      };
      setRounds((prev) => [...prev, newRound]);
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
    const skillsToDuplicate = lastRound.skills.map((skill) => ({
      ...skill,
      id: uuidv4(),
    }));
    setCurrentRoundSkills((prev) => [...prev, ...skillsToDuplicate]);
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
      toast.success("Session saved successfully!", {
        duration: 4000,
      });
      router.push("/dashboard");
    } else {
      setIsSaving(false);
      toast.error("Failed to save session", {
        duration: 4000,
      });
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
      <div className="max-w-md mx-auto p-3 pt-4 flex flex-col gap-4">
        <div className="gap-2">
          <h1 className="font-bold text-2xl text-foreground">New Training Session</h1>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-bold text-foreground">
            Add Skill Code
          </p>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-card border border-border rounded-xl font-mono text-base flex items-center overflow-hidden">
              {currentInput.length === 0 ? (
                <span className="text-muted-foreground text-sm">e.g. 41/ or 8-1/</span>
              ) : (
                <div className="whitespace-pre">
                  <span className="text-foreground">{currentInput}</span>
                  <span className="text-muted-foreground animate-pulse">
                    {skillSuggestion}
                  </span>
                </div>
              )}
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
          <p className="text-xs text-muted-foreground leading-tight">
            Press Space or Enter to add. Tip: Type &apos; - &apos; alone to
            record your max time.
          </p>
        </div>
        {showTofInput && (
          <TofBanner
            tofValue={tofValue}
            setTofValue={setTofValue}
            onSave={(tofNum) => {
              const newSkill: Skill = {
                id: uuidv4(),
                fig_code: "-",
                difficulty: 0,
                tof: tofNum,
              };
              setCurrentRoundSkills((prev) => [...prev, newSkill]);
              setShowTofInput(false);
              setTofValue("");
            }}
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

        <SmartKeyboard onKeyPress={handleKeyPress} />

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
  );
}
