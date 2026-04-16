import { createClient } from "@/utils/supabase/server";

function getStartDate(timeFilter: string): Date | null {
    const now = new Date();
    if (timeFilter === "month") {
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFilter === "year") {
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    else if (timeFilter === "week") {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    }
    else if (timeFilter === "day") {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    }
    return null;
}


export async function getTopOverviewStats(userId: string, timeFilter: string) {
    const supabase = await createClient();

    const startDate = getStartDate(timeFilter);

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
    const startDate = getStartDate(timeFilter);

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
    const startDate = getStartDate(timeFilter);

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
    const startDate = getStartDate(timeFilter);
    
    
    let query = supabase
    .from('rounds')
    .select('fig_string, sessions!inner(user_id, date)')
    .eq('sessions.user_id', userId);
    
    if (startDate) {
        query = query.gte('sessions.date', startDate.toISOString());
    }
    const { data: dict } = await supabase.from('skills').select('code, direction');
    const directionMap = Object.fromEntries((dict || []).map(s => [s.code, s.direction]));
    
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

export async function getFrequentSkills(userId: string, timeFilter: string) {
    const supabase = await createClient();
    let query = supabase
        .from('rounds')
        .select('fig_string, sessions!inner(user_id, date)')
        .eq('sessions.user_id', userId);
    const startDate = getStartDate(timeFilter);
    if (startDate) {
        query = query.gte('sessions.date', startDate.toISOString());
    }
    
    const { data: dict } = await supabase
    .from('user_skills')
    .select('skills!inner(code, name, direction)')
    .eq('user_id', userId)
    .eq('status', 'mastered');

    const nameMap = Object.fromEntries(
    (dict || []).map(s => {
        const key = s.skills.direction 
        ? s.skills.direction + s.skills.code 
        : s.skills.code;
        return [key, { name: s.skills.name, direction: s.skills.direction }];
    })
    );


    
    
    const { data: roundsErrorFree } = await query;
    const rounds = roundsErrorFree || [];

    const counts: Record<string, number> = {};

    rounds.forEach(round => {
        const jumpCodes = round.fig_string.split(" ");
        jumpCodes.forEach(code => {
            if (!nameMap[code]) return;
            
            counts[code] = (counts[code] || 0) + 1;
        });
    });

    const sortedSkills = Object.entries(nameMap)
        .map(([code, info]) => ({
            code,
            name: info.name,
            count: counts[code] || 0,
            direction: info.direction as string | null
        }))
        .sort((a, b) => b.count - a.count);

    return sortedSkills;
}

export async function getTenJumpTimeProgression(userId: string, filter: string) {
    const supabase = await createClient();
    let query = supabase
        .from('ten_jump_times')
        .select('created_at, ten_jump_time')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    const startDate = getStartDate(filter);
    if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
    }

    const { data: times, error } = await query;
    if (error || !times) return [];

    const groupedByDay = times.reduce((accumulator, current) => {
        if (!current.created_at) return accumulator;
        
        const dateObj = new Date(current.created_at);
        const dayLabel = `${dateObj.getDate()}. ${dateObj.getMonth() + 1}.`;

        if (!accumulator[dayLabel]) {
            accumulator[dayLabel] = { sum: 0, count: 0 };
        }
        
        accumulator[dayLabel].sum += current.ten_jump_time;
        accumulator[dayLabel].count += 1;
        return accumulator;
        
    }, {} as Record<string, { sum: number; count: number }>);

    return Object.entries(groupedByDay).map(([date, stats]) => ({
        date,
        time: Number((stats.sum / stats.count).toFixed(2))
    }));
}

export async function getRoutineTofProgression(userId: string, filter: string) {
    const supabase = await createClient();
    let query = supabase
        .from('routines')
        .select('created_at, tof')
        .eq('user_id', userId)
        .not('tof', 'is', null) 
        .order('created_at', { ascending: true });

    const startDate = getStartDate(filter);
    if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
    }

    const { data: routines, error } = await query;
    if (error || !routines) return [];

    const groupedByDay = routines.reduce((accumulator, current) => {
        if (!current.created_at || current.tof === null) return accumulator;
        
        const dateObj = new Date(current.created_at);
        const dayLabel = `${dateObj.getDate()}. ${dateObj.getMonth() + 1}.`;

        if (!accumulator[dayLabel]) {
            accumulator[dayLabel] = { sum: 0, count: 0 };
        }
        
        accumulator[dayLabel].sum += current.tof;
        accumulator[dayLabel].count += 1;
        return accumulator;
    }, {} as Record<string, { sum: number; count: number }>);

    return Object.entries(groupedByDay).map(([date, stats]) => ({
        date,
        time: Number((stats.sum / stats.count).toFixed(2))
    }));
}
