import { createClient } from "@/utils/supabase/server";

export async function getTopOverviewStats(userId: string, timeFilter: string) {
    const supabase = await createClient();

    const now = new Date();
    let startDate: Date | null = null;

    if (timeFilter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFilter === "year") {
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }

    let query = supabase
        .from('sessions')
        .select('id, total_rounds, total_routines, max_difficulty')
        .eq('user_id', userId);

    if (startDate) {
        query = query.gte('date', startDate.toISOString());
    }

    const { data: sessionsErrorFree } = await query;
    const sessions = sessionsErrorFree || [];
    const trainings = sessions.length;

    const totalRounds = sessions.reduce((acc, curr) => {
        return acc + (curr.total_rounds || 0);
    }, 0);

    const routines = sessions.reduce((acc, curr) => {
        return acc + (curr.total_routines || 0);
    }, 0);

        let skillsQuery = supabase
        .from("user_skills")
        .select('status, skills(difficulty_value)')
        .eq("user_id", userId)
        .eq("status", "mastered");

    if (startDate) {
        skillsQuery = skillsQuery.gte('date_mastered', startDate.toISOString());
    }
    const { data: userSkillsErrorFree } = await skillsQuery;
    const userSkills = userSkillsErrorFree || [];

     const maxSkillDiff = (userSkills || []).reduce((acc, curr) => {
        return Math.max(acc, curr.skills.difficulty_value || 0);
    }, 0);
    const maxRoutineDiff = sessions.reduce((acc, curr) => {
        return Math.max(acc, curr.max_difficulty || 0);
    }, 0);

    return { trainings, totalRounds, routines, maxSkillDiff, maxRoutineDiff };

}
