"use server";

import { createClient } from "@/utils/supabase/server";
import { Round } from "@/types/training";
import { Database } from "@/types/supabase";

export async function finishTrainingSession(rounds: Round[], rating: number, notes: string) {
  const supabase = await createClient();

    const { 
    data: { session } 
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { success: false, error: "Not logged in" };
  }
  
  let maxDiff = 0;
  let totalJumps = 0;
  let totalRoutines = 0; 
  for ( const round of rounds){
    if(round.is_routine){
      totalRoutines++;
    }
    for ( const skill of round.skills){
      if (skill.fig_code !== "-") { 
         totalJumps++;
      }
      if (skill.difficulty > maxDiff){
        maxDiff = skill.difficulty;
      }
    }
  }
  const totalDiff = Number(rounds.reduce((sum, r) => sum + r.total_difficulty, 0).toFixed(2));

  const tenJumpsTimesToInsert = rounds
  .flatMap(round => round.skills)
  .filter(skill => skill.fig_code === "-" && skill.tof !== undefined)
  .map(skill => {
    return {
      user_id: session.user.id,
      ten_jump_time: skill.tof!,
      created_at: new Date().toISOString(),
    }
  })

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: session.user.id,
      max_difficulty: Number(maxDiff.toFixed(2)),
      total_difficulty: totalDiff,
      total_rounds: rounds.length,
      rating: rating,
      notes: notes,
      total_jumps: totalJumps,
      total_routines: totalRoutines,
      date: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (sessionError || !sessionData) {
    console.error("Error saving session:", sessionError);
    return { success: false, error: "Failed to create session" };
  }


  const roundsToInsert = rounds.map(round => {
    const skillTof = round.skills.find(s => s.fig_code === "-" && s.tof !== undefined)?.tof;
    
    return {
      session_id: sessionData.id,
      fig_string: round.skills.map(s => s.fig_code).join(" "),
      difficulty: Number(round.total_difficulty.toFixed(2)),
      tof: round.tof ?? skillTof,
      is_routine: round.is_routine,
      routine_type: round.routine_type,
    };
  });
  const routinesToInsert = rounds
  .filter(round => round.is_routine === true)
  .map(round => {
    return{
      session_id: sessionData.id,
      user_id: session.user.id,
      skills_string: round.skills
      .filter(skill => skill.fig_code !== "-")
      .map(skill => skill.fig_code).join(" "),
      routine_type: round.routine_type,
      difficulty: Number(round.total_difficulty.toFixed(2)),
      tof: round.tof,
      created_at: new Date().toISOString(),
    }
  })
  if(routinesToInsert.length > 0){
    const { error: routinesError } = await supabase
    .from("routines")
    .insert(routinesToInsert);
  
    if (routinesError) {
      console.error("Error saving routines:", routinesError);
      await supabase.from("sessions").delete().eq("id", sessionData.id);
      return { success: false, error: "Failed to save routines" };
    }
  }

  if(tenJumpsTimesToInsert.length > 0){
    const { error: ten_jump_timesError } = await supabase
    .from("ten_jump_times")
    .insert(tenJumpsTimesToInsert);

    if (ten_jump_timesError) {
      console.error("Error saving 10 jumps:", ten_jump_timesError);
      await supabase.from("sessions").delete().eq("id", sessionData.id);
      return { success: false, error: "Failed to save 10 jumps" };
    }
  }

  const { error: roundsError } = await supabase
    .from("rounds")
    .insert(roundsToInsert);

  if (roundsError) {
    console.error("Error saving rounds:", roundsError);
    await supabase.from("sessions").delete().eq("id", sessionData.id);
    return { success: false, error: "Failed to save rounds" };
  }


  return { success: true, sessionId: sessionData.id };
}

export async function getSmartSkillScores(userId: string) {
    const supabase = await createClient();
    
    // Vezmeme jen skoky za poslední půlrok, ať nepočítáme celou historii
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: roundsErrorFree } = await supabase
        .from('rounds')
        .select('fig_string, sessions!inner(date)')
        .eq('sessions.user_id', userId)
        .gte('sessions.date', sixMonthsAgo.toISOString());

    const rounds = roundsErrorFree || [];
    const scores: Record<string, number> = {};
    const now = new Date();

    rounds.forEach(round => {
        if (!round.fig_string || !round.sessions?.date) return;

        const sessionDate = new Date(round.sessions.date);
        const daysAgo = (now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24);
        
        let scoreWeight = 1;
        if (daysAgo <= 7) scoreWeight = 5;       // Tento týden
        else if (daysAgo <= 30) scoreWeight = 3; // Tento měsíc
        else if (daysAgo <= 90) scoreWeight = 2; // Toto čtvrtletí

        const jumpCodes = round.fig_string.split(" ");
        jumpCodes.forEach(code => {
            if (code === "-") return; // TOF nás nezajímá jako prvek k napovídání
            scores[code] = (scores[code] || 0) + scoreWeight;
        });
    });

    return scores;
}

export async function saveRound(name: string, figString: string, difficulty: number, isRoutine: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in" };

  const { data, error } = await supabase
    .from("saved_rounds")
    .insert({
      user_id: user.id,
      name,
      fig_string: figString,
      difficulty,
      is_routine: isRoutine
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving round:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function getSavedRounds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_rounds")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved rounds:", error);
    return [];
  }
  return data;
}

export async function deleteSavedRound(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("saved_rounds")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting saved round:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
