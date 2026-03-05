"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SmartKeyboard from "@/components/SmartKeyboard";

type Skill = {
  id: string;
  fig_code: string;
  difficulty: number;
};
type Round = {
  id: string;
  skills: Skill[];
  total_difficulty: number;
};

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
    
    setCurrentRoundSkills(prevSkills => {
        if (prevSkills.length === 0) return prevSkills;

        const copiesToAdd: Skill[] = [];
        
        for (let i = 0; i < multiplier - 1; i++) {
            const duplicatedSkills = prevSkills.map(skill => ({
                ...skill,         
                id: uuidv4()      
            }));
            copiesToAdd.push(...duplicatedSkills);
        }
        return [...prevSkills, ...copiesToAdd];
    });

}
else {
      setCurrentInput((prev) => prev + key);
    }
  };
  return (
    <div>
      <p>Current input: {currentInput}</p>
      <p>
        Current round skills:{" "}
        {currentRoundSkills.map((skill) => skill.fig_code)}
      </p>
      <p>
        Rounds:{" "}
        {rounds.map((round) => round.skills.map((skill) => skill.fig_code))}
      </p>
      <h1>Log</h1>
      <SmartKeyboard onKeyPress={handleKeyPress} />
    </div>
  );
}
