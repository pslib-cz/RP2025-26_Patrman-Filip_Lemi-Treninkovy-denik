"use client";
import { useActionState, useRef, useState } from "react";
import { updateProfile } from "../login/actions";

import Lemi from "@/components/Lemi-mascot";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { User } from "lucide-react";

export default function OnboardingPage() {
  const [state, formAction] = useActionState(updateProfile, { error: null });
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 5) {
      toast.error("File is too large. Maximum size is 5MB.");
      e.target.value = "";
      return;
    }

    const toastId = toast.loading("Uploading..");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const filePath = `${user.id}/${Math.random()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) {
      toast.error("Upload failed: " + error.message, { id: toastId });
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(publicUrl);

    toast.success("Profile picture updated!", { id: toastId });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-3">
          <Lemi size="xl" expression="excited" />
          <h1 className="text-balance text-center text-3xl font-bold tracking-tight text-foreground">
            Complete your profile
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Just a few more details to get started with Lemi.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          {state.error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {state.error}
            </div>
          )}
          <div className="flex flex-col gap-2 items-center justify-center w-full mb-4">
            <label className="text-sm font-medium text-foreground mb-2">
              Profile Picture
            </label>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden group hover:opacity-80 transition-opacity"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <User className="h-12 w-12 rounded-full text-primary" />
              )}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 transition-opacity text-white text-xs font-bold">
                UPLOAD
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <input type="hidden" name="avatar_url" value={avatarUrl} />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="What should we call you?"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="full_name"
              className="text-sm font-medium text-foreground"
            >
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              placeholder="Your full name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="age"
                className="text-sm font-medium text-foreground"
              >
                Age
              </label>
              <input
                id="age"
                type="number"
                name="age"
                placeholder="Years"
                min="0"
                max="120"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-foreground"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="weight"
                className="text-sm font-medium text-foreground"
              >
                Weight
              </label>
              <input
                id="weight"
                type="number"
                name="weight"
                placeholder="kg"
                min="0"
                max="500"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="height"
                className="text-sm font-medium text-foreground"
              >
                Height
              </label>
              <input
                id="height"
                type="number"
                name="height"
                placeholder="cm"
                min="0"
                max="300"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-base font-semibold text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Let&apos;s start training!
          </button>
        </form>
      </div>
    </div>
  );
}
