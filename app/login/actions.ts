"use server"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type AuthState = {
  error: string | null;
};


export async function login(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vyplňte jméno a heslo" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUp(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) {
        return { error: "Vyplňte jméno a heslo" };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });
  if (error) {
    return redirect("/login?message=Could not authenticate with Google");
  }

  if (data.url) {
    redirect(data.url);
  }
}


export async function updateProfile(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); 
  
  if (!user) return { error: "Security hlásí: Unauthorized" };

  const username = formData.get("username") as string;
  const gender = formData.get("gender") as string;
  const age = formData.get("age") as string;
  const full_name = formData.get("full_name") as string;
  
  if (!username) return { error: "Uživatelské jméno je povinné pro pokračování." };

  const { error } = await supabase
    .from('profiles')
    .update({ 
       username: username,
       gender: gender,
       age: age ? Number.parseInt(age, 10) : null,
       full_name: full_name,
       updated_at: new Date().toDateString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  redirect("/dashboard");
}
