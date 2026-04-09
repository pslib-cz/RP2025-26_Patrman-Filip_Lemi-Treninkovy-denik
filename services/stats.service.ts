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

export async function getAverageRating(userId: string, timeFilter: string) {
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
        .select('rating')
        .eq('user_id', userId);

    if (startDate) {
        query = query.gte('date', startDate.toISOString());
    }

    const { data: sessionsErrorFree } = await query;
    const sessions = sessionsErrorFree || [];
    if (sessions.length === 0) return 0;
    const averageRating = sessions.reduce((acc, curr) => {
        return acc + (curr.rating || 0);
    }, 0) / sessions.length;
    return averageRating;
}

export async function getRoutineSuccessRate(userId: string, timeFilter: string){
    const supabase = await createClient();
    const now = new Date();
    let startDate: Date | null = null;

    if (timeFilter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFilter === "year") {
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }

    let query = supabase
        .from('routines')
        .select('skills_string')
        .eq('user_id', userId);

    if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
    
    }
    const { data: routinesErrorFree } = await query;
    const routines = routinesErrorFree || [];

    if (routines.length === 0) return 0;

    const successfulRoutines = routines.filter((routine) => {
        if (!routine.skills_string) return false; 
        
        const jumpsArray = routine.skills_string.split(" ");
        
        return jumpsArray.length === 10;
    });
    return (successfulRoutines.length / routines.length) * 100;

}

export async function getFlipDirectionRatio(userId: string, timeFilter: string) {
    const supabase = await createClient();
    const now = new Date();
    let startDate: Date | null = null;

    if (timeFilter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFilter === "year") {
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }

    const { data: dict } = await supabase.from('skills').select('code, direction');
    const directionMap = Object.fromEntries((dict || []).map(s => [s.code, s.direction]));
    
    let query = supabase
    .from('rounds')
    .select('fig_string, sessions!inner(user_id, date)')
    .eq('sessions.user_id', userId);

if (startDate) {
    query = query.gte('sessions.date', startDate.toISOString());
}

    const { data: roundsErrorFree } = await query;
    const rounds = roundsErrorFree || [];
    
    let front = 0;
    let back = 0;
    
    rounds.forEach(round => {
        const jumpCodes = round.fig_string.split(" ");
        jumpCodes.forEach(code => {
             const direction = directionMap[code];
             
             if (direction === 'F') front++;
             else if (direction === 'B') back++;
        });
    });
    
    const total = front + back;
    if (total === 0) return { frontRatio: 0, backRatio: 0 };
    
    return { 
         frontRatio: (front / total) * 100, 
         backRatio: (back / total) * 100 
    };
}
