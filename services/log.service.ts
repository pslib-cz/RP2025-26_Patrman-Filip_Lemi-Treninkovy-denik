"use server";

import { createClient } from "@/utils/supabase/server";
import { Round } from "@/types/training";

export async function finishTrainingSession(rounds: Round[], rating: number, notes: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
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
      user_id: user.id,
      ten_jump_time: skill.tof!,
      created_at: new Date().toISOString(),
    }
  })

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
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
    console.error("Chyba při uložení session:", sessionError);
    return { success: false, error: "Failed to create session" };
  }

  const roundsToInsert = rounds.map(round => ({
    session_id: sessionData.id,
    fig_string: round.skills.map(s => s.fig_code).join(" "),
    difficulty: Number(round.total_difficulty.toFixed(2)),
    tof: round.skills.length,
  }));
  const routinesToInsert = rounds
  .filter(round => round.is_routine === true)
  .map(round => {
    return{
      session_id: sessionData.id,
      user_id: user.id,
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
      console.error("Chyba při uložení rutin:", routinesError);
      return { success: false, error: "Failed to save routines" };
    }
  }

  if(tenJumpsTimesToInsert.length > 0){
    const { error: ten_jump_timesError } = await supabase
    .from("ten_jump_times")
    .insert(tenJumpsTimesToInsert);

    if (ten_jump_timesError) {
      console.error("Chyba při uložení 10ti skoků:", ten_jump_timesError);
      return { success: false, error: "Failed to save 10 jumps" };
    }
  }

  const { error: roundsError } = await supabase
    .from("rounds")
    .insert(roundsToInsert);

  if (roundsError) {
    console.error("Chyba při uložení kol:", roundsError);
    return { success: false, error: "Failed to save rounds" };
  }


  return { success: true, sessionId: sessionData.id };
}
