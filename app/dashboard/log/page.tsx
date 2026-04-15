import { createClient } from "@/utils/supabase/server";
import LogClient from "./LogClient";
import { UserSkills } from "@/types/training";
import { getSmartSkillScores } from "@/services/log.service";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const skillScores = await getSmartSkillScores(user.id);
  const [skillsResponse, userSkillsResponse] = await Promise.all([
    supabase.from("skills").select("*"),
    supabase.from("user_skills").select("*").eq("user_id", user.id),
  ]);

  if (skillsResponse.error || userSkillsResponse.error) {
    console.error(
      "Failed to load skills dictionary:",
      skillsResponse.error?.message,
    );
    return;
  }
  return (
    <LogClient
      dictionary={skillsResponse.data || []}
      userSkills={(userSkillsResponse.data as UserSkills[]) || []}
      skillScores={skillScores}
    />
  );
}
