import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { BottomNav } from "@/components/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id || "")
    .single();

  if (!profile?.username) {
    redirect("/onboarding");
  }

  return (
    <>
      {
        <div className="flex min-h-dvh flex-col pb-16">
          <main>{children}</main>
          <BottomNav />
        </div>
      }
    </>
  );
}
