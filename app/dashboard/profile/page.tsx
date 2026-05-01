import { createClient } from "@/utils/supabase/server";
import { ProfileData, ProfileForm } from "./ProfileForm";
import { signOut } from "@/app/login/actions";
import { LogOut, Star } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { 
    data: { session } 
  } = await supabase.auth.getSession();

  if (!session?.user?.id) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, age, gender, weight, height, avatar_url")
    .eq("id", session.user.id)
    .single();

  const { data: routines } = await supabase
    .from("saved_rounds")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("is_routine", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
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

      <div className={`flex flex-col gap-4 ${routines?.length ? "md:grid md:grid-cols-2 md:gap-6 md:items-start" : "md:max-w-5xl lg:max-w-5xl"}`}>
        <div className="bg-card flex flex-col rounded-3xl shadow-sm border border-border p-5">
          <h2 className="text-foreground font-bold mb-5">Personal Information</h2>
          <ProfileForm initialData={profile as ProfileData} userId={session.user.id} />
        </div>

        {routines && routines.length > 0 && (
          <div className="bg-card flex flex-col rounded-3xl shadow-sm border border-border p-5 bg-gradient-to-br from-card to-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary fill-primary" />
              </div>
              <h2 className="text-foreground font-bold">My Routine</h2>
            </div>
            <div className="space-y-4">
              {routines.map((routine) => (
                <div key={routine.id} className="p-4 bg-background/50 border border-border rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-foreground">{routine.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-tight">
                      Diff: {routine.difficulty.toFixed(1)}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/50 break-words leading-relaxed">
                    {routine.fig_string}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
