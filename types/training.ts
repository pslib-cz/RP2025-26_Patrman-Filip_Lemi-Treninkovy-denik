export type Skill = {
  id: string;
  fig_code: string;
  difficulty: number;
  tof?: number;
};
export type Round = {
  id: string;
  skills: Skill[];
  total_difficulty: number;
  is_routine?: boolean;
  routine_type?: "VS" | "PS";
  tof?: number;
};

export type DbSkill = {
  id: string;
  code: string;
  name: string;
  difficulty_value: number;
  direction: string;
};
