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

export interface SessionHistory {
  id: string;
  date: string;
  rating: number | null;
  total_difficulty: number | null;
  total_rounds: number | null;
  notes: string | null;
  total_jumps: number | null;
  total_routines: number | null;
  rounds: {
    id: string;
    fig_string: string;
    difficulty: number | null;
    tof: number | null;
    is_routine: boolean | null;
    routine_type: string | null;
  }[];
}
export type UserSkills = {
  id: string;
  user_id: string;
  skill_id: string;
  status: "not_started" | "learning" | "mastered";
  date_mastered?: string | null;
  updated_at?: string | null;
}