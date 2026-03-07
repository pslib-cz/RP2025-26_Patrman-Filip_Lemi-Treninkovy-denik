import { createClient } from "@/utils/supabase/server";
import LogClient from "./LogClient";

export default async function LogPage() {
  const supabase = await createClient();

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*");

  if (error) {
    console.error("Nepodařilo se načíst slovník skillů:", error.message);
  }

  return <LogClient dictionary={skills || []} />;
}
