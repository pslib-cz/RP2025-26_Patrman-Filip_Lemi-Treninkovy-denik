import { createClient } from "@/utils/supabase/server";
import LogClient from "./LogClient";
import { UserSkills, SavedRound } from "@/types/training";
import { getSmartSkillScores } from "@/services/log.service";

export default async function LogPage() {
  const supabase = await createClient();
    const { 
    data: { session } 
  } = await supabase.auth.getSession();
  
  if (!session?.user?.id) return;
  const skillScores = await getSmartSkillScores(session.user.id);
  const [skillsResponse, userSkillsResponse, savedRoundsResponse] =
    await Promise.all([
      supabase.from("skills").select("*"),
      supabase.from("user_skills").select("*").eq("user_id", session.user.id),
      supabase
        .from("saved_rounds")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false }),
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
      initialSavedRounds={(savedRoundsResponse.data as SavedRound[]) || []}
    />
  );
}
