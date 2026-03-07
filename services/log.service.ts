"use server";

import { createClient } from "@/utils/supabase/server"; // Tady si nejsem jistý tvojí cestou k Supabase klientovi, ujisti se, že je správná!
import { Round } from "@/types/training";

export async function finishTrainingSession(rounds: Round[], rating: number, notes: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not logged in" };
  }

  const maxDiff = Math.max(...rounds.map(r => r.total_difficulty), 0);
  const totalDiff = rounds.reduce((sum, r) => sum + r.total_difficulty, 0);

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      max_difficulty: maxDiff,
      total_difficulty: totalDiff,
      total_rounds: rounds.length,
      rating: rating,
      notes: notes,
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
    difficulty: round.total_difficulty,
    tof: round.skills.length,
  }));

  const { error: roundsError } = await supabase
    .from("rounds")
    .insert(roundsToInsert);

  if (roundsError) {
    console.error("Chyba při uložení kol:", roundsError);
    return { success: false, error: "Failed to save rounds" };
  }

  return { success: true, sessionId: sessionData.id };
}
