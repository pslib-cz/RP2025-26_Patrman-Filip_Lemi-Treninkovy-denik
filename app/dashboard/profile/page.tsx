import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./ProfileForm"; 

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, age, gender")
    .eq("id", user?.id || "")
    .single();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto w-full">
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-2xl font-bold text-black">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your jump details</p>
      </div>

      <div className="bg-white flex flex-col rounded-2xl shadow-sm border border-slate-100 p-5 mt-2">
          <h2 className="text-black font-bold mb-5">Personal Information</h2>
          <ProfileForm initialData={profile} userId={user?.id} />
      </div>
    </div>
  );
}
