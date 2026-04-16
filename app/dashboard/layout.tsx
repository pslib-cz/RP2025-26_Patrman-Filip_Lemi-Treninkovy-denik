import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "react-hot-toast";
import InstallPrompt from "@/components/InstallPrompt";

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
          <Toaster position="top-center" />
          <InstallPrompt />
          <main>{children}</main>
          <BottomNav />
        </div>
      }
    </>
  );
}
