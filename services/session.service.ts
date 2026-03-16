import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
        total_jumps,
        total_routines,
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

export async function getSessionById(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: session, error } = await supabase
    .from("sessions")
    .select(`
        id,
        date,
        rating,
        total_difficulty,
        total_rounds,
        notes,
        total_jumps,
        total_routines,
        rounds (
            id,
            fig_string,
            difficulty,
            is_routine,
            routine_type,
            tof
        )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
    if(error){
        console.error("Error fetching session:", error);
        redirect("/dashboard/sessions");
    }
    return session
}

export async function deleteSession(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
    if(error){
        console.error("Error deleting session:", error);
        return { success: false, error: "Failed to delete session" };
    }
    return { success: true };
}