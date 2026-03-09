"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SmartKeyboard from "@/components/SmartKeyboard";
import { Skill, Round, DbSkill } from "@/types/training";
import { CurrentRoundBoard } from "@/components/CurrentRoundBoard";
import { CopyCheckButton } from "@/components/copycheck-button";
import { LoggedRoundsList } from "@/components/LoggedRoundsList";
import { finishTrainingSession } from "@/services/log.service";
import { Zap } from "lucide-react";
import { FinishSessionScreen } from "@/components/FinishSessionScreen";
import { TofBanner } from "@/components/TofBanner";

export default function LogClient({ dictionary }: { dictionary: DbSkill[] }) {
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

  const handleKeyPress = (key: string) => {
    setErrorMsg(null);

    if (key === "SPACE") {
      if (currentInput.trim() === "") return;

      let finalDiff = 0;

      if (currentInput === "-") {
        setShowTofInput(true);
        setTofValue("");
        finalDiff = 0;
      } else {
        const foundSkill = dictionary.find(
          (skill) => skill.code === currentInput,
        );
        if (!foundSkill) {
          setErrorMsg("Skill code not found in dictionary");
          return;
        }
        finalDiff = foundSkill.difficulty_value;
      }
      const newSkill: Skill = {
        id: uuidv4(),
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
          }));
          copiesToAdd.push(...duplicatedSkills);
        }
        return [...prevSkills, ...copiesToAdd];
      });
    } else {
      setCurrentInput((prev) => prev + key);
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
  const handleFinishSession = () => {
    if (rounds.length === 0) return;
    setIsFinishing(true);
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <FinishSessionScreen
          rating={rating}
          setRating={setRating}
          notes={notes}
          setNotes={setNotes}
          onSave={() => finishTrainingSession(rounds, rating, notes)}
          onCancel={() => setIsFinishing(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-md mx-auto p-4 pt-8 flex flex-col gap-6">
        

        <div className="gap-2">
          <h1 className="font-bold text-2xl">New Training Session</h1>
          <p className="text-sm text-muted-foreground">Datum</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg">Add Skill Code</p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="none"
              readOnly={true}
              value={currentInput}
              placeholder="e.g. 41/ or 8-1/"
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleKeyPress("SPACE")}
              className="w-12 h-12 bg-primary text-white hover:bg-accent rounded-xl flex items-center justify-center transition-colors"
            >
              <Zap className="w-5 h-5 fill-white" />
            </button>
          </div>
          {errorMsg && (
            <p className="text-sm font-semibold text-destructive animate-pulse">
              {errorMsg}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Press Space or Enter to add. Tip: Type &apos; - &apos; alone to
            record your 10-jump max time.
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
