import { createClient } from "@/utils/supabase/server";

export async function getSessionHistory(){
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`
        id,
        date,
        rating,
        total_difficulty,
        total_rounds,
        notes,
        rounds (
            id,
            fig_string,
            difficulty,
            is_routine,
            routine_type,
            tof
        )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching sessions:", error);
        return [];
    }

    return sessions || [];
}