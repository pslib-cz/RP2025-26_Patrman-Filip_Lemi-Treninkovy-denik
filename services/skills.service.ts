"use server"
import { createClient } from "@/utils/supabase/server";

export async function getSkills() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return
    const [skills, userSkills] = await Promise.all([
        supabase.from("skills").select("*"),
        supabase.from("user_skills").select("*").eq("user_id", user.id)
    ])
      
    if (skills.error || userSkills.error) {
        console.error("Failed to load skills dictionary:", skills.error?.message);
        return [];
    }

    const skillLibrary = skills.data.map((skill) => {
        const userSkill = userSkills.data.find((userSkill) => userSkill.skill_id === skill.id);
        return {
            id: skill.id,
            name: skill.name,
            difficulty_value: skill.difficulty_value,
            direction: skill.direction,
            fig_code: skill.code,
            status: userSkill?.status || "not_started",
            date_mastered: userSkill?.date_mastered || null,
            updated_at: userSkill?.updated_at || null,
        }
    })
    return skillLibrary;
}

export async function updateSkillStatus(skillId: string, status: "not_started" | "learning" | "mastered") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
    .from("user_skills")
    .upsert({
        user_id: user.id,
        skill_id: skillId,
        status: status,
        updated_at: new Date().toISOString(),
        date_mastered: status === "mastered" ? new Date().toISOString() : null
    }, { onConflict: "user_id, skill_id"})
    if (error) {
        console.error("Failed to update skill status:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true };
}