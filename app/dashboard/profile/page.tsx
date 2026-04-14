import { createClient } from "@/utils/supabase/server";
import { ProfileData, ProfileForm } from "./ProfileForm";
import { signOut } from "@/app/login/actions";
import { LogOut } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, age, gender, weight, height, avatar_url")
    .eq("id", user?.id || "")
    .single();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your jump details
          </p>
        </div>
        <form action={signOut}>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 border border-border rounded-xl transition-all active:scale-95"
            type="submit"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </form>
      </div>

      <div className="bg-card flex flex-col rounded-2xl shadow-sm border border-border p-5 mt-2">
        <h2 className="text-foreground font-bold mb-5">Personal Information</h2>
        <ProfileForm initialData={profile as ProfileData} userId={user?.id} />
      </div>
    </div>
  );
}
