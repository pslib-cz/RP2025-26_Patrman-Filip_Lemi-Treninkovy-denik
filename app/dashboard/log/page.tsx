import { createClient } from "@/utils/supabase/server";
import LogClient from "./LogClient";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return
  const [skillsResponse, userSkillsResponse] = await Promise.all([
    supabase.from("skills").select("*"),
    supabase.from("user_skills").select("*").eq("user_id", user.id)
  ])
  
  if (skillsResponse.error || userSkillsResponse.error) {
    console.error("Nepodařilo se načíst slovník skillů:", skillsResponse.error?.message);
    return;
  }
  return <LogClient dictionary={skillsResponse.data || []} userSkills={userSkillsResponse.data || []} />;
}
