"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type SkillStat = {
  code: string;
  name: string;
  count: number;
  direction: string | null;
};
interface Props {
  skills: SkillStat[];
  highestCount: number;
}
export default function StatsFrequentSkillsClient({
  skills,
  highestCount,
}: Props) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(
    skills.slice(0, 3).map((s) => s.code),
  );
  const handleSkillChange = (arrayIndex: number, newCode: string) => {
    const newSelected = [...selectedCodes];
    newSelected[arrayIndex] = newCode;
    setSelectedCodes(newSelected);
  };

  return (
    <div className="flex flex-col bg-card rounded-xl p-5 shadow-sm border border-border h-full col-span-2">
      <h3 className="text-foreground font-bold mb-6">Most frequent skills</h3>

      <div className="w-full flex flex-col gap-6">
        {selectedCodes.map((code, index) => {
          const skill = skills.find((s) => s.code === code);
          if (!skill) return null;

          return (
            <div key={`${code}-${index}`} className="w-full">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-foreground font-bold">
                    {skill.name}{" "}
                    <span className="text-muted-foreground text-sm">
                      ({skill.code})
                    </span>
                  </h4>
                  <div className="relative flex items-center">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <select
                      value={skill.code}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      {skills.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} {s.code} ({s.count}x)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="font-bold text-primary">{skill.count}x</p>
              </div>

              <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(skill.count / highestCount) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
