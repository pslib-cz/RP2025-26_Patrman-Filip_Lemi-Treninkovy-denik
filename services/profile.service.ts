"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProfileData } from "@/app/dashboard/profile/ProfileForm";

export async function updateProfileData(userId: string | undefined, data: ProfileData) {
  if (!userId) {
    return { error: "Security check failed: Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      username: data.username,
      full_name: data.full_name,
      age: data.age,
      gender: data.gender,
      weight: data.weight,
      height: data.height,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Update profile error:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard"); 

  return { success: true };
}
