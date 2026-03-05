"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SmartKeyboard from "@/components/SmartKeyboard";
import { Check, Copy, Zap } from "lucide-react";
import { Skill, Round } from "@/types/training";
import { CurrentRoundBoard } from "@/components/CurrentRoundBoard";

export default function LogPage() {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentRoundSkills, setCurrentRoundSkills] = useState<Skill[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  const handleKeyPress = (key: string) => {
    if (key === "SPACE") {
      if (currentInput.trim() === "") return;
      const newSkill: Skill = {
        id: uuidv4(),
        fig_code: currentInput,
        difficulty: 1,
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
  const handleConfirmRound = () => {
    if (currentRoundSkills.length === 0) return;

    const newRound: Round = {
      id: uuidv4(),
      skills: currentRoundSkills,
      total_difficulty: currentRoundSkills.reduce(
        (acc, skill) => acc + skill.difficulty,
        0,
      ),
    };
    setRounds((prev) => [...prev, newRound]);
    setCurrentRoundSkills([]);
    setCurrentInput("");
  };
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
              readOnly
              inputMode="none"
              value={currentInput}
              placeholder="e.g. 41/ or 8-1/"
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
            />
            <button className="w-12 h-12 bg-primary text-white hover:bg-accent rounded-xl flex items-center justify-center transition-colors">
              <Zap className="w-5 h-5 fill-white" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Press Space or Enter to add. Tip: Type &apos; - &apos; alone to
            record your 10-jump max time.
          </p>
        </div>
        {currentRoundSkills.length > 0 && (
          <CurrentRoundBoard
            skills={currentRoundSkills}
            onConfirm={handleConfirmRound}
          />
        )}
        <p>
          Rounds:{" "}
          {rounds.map((round) => round.skills.map((skill) => skill.fig_code))}
        </p>

        <SmartKeyboard onKeyPress={handleKeyPress} />

        <div className="mt-4 flex gap-3">
          <button className="flex-1 py-3 bg-white border border-border text-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Copy className="w-5 h-5" />
            Duplicate Last
          </button>

          <button className="flex-[1.5] py-3 bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-500 transition-colors shadow-sm focus:ring-2 focus:ring-slate-400 focus:outline-none">
            <Check className="w-5 h-5" />
            Finish Session
          </button>
        </div>
      </div>
    </div>
  );
}
