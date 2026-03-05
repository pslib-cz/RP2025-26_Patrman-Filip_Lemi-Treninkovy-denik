export type Skill = {
  id: string;
  fig_code: string;
  difficulty: number;
};
export type Round = {
  id: string;
  skills: Skill[];
  total_difficulty: number;
};