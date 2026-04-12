"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Edit2, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateProfileData } from "@/services/profile.service";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Too short").max(20, "Too long"),
  full_name: z.string().nullable(),
  age: z.number().min(1, "Invalid age").max(120).nullable(),
  gender: z.enum(["male", "female", "other"]).nullable(),
});

export type ProfileData = z.infer<typeof profileSchema>;

interface Props {
  initialData: ProfileData | null;
  userId: string | undefined;
}

export function ProfileForm({ initialData, userId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<ProfileData>({
    username: initialData?.username || "",
    full_name: initialData?.full_name || "",
    age: initialData?.age || 0,
    gender: initialData?.gender || null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentData,
  });

  const onSubmit = async (data: ProfileData) => {
    const result = await updateProfileData(userId, data);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile saved!");
      setCurrentData(data);
      setIsEditing(false);
    }
    reset(data);
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="overflow-hidden flex-1">
            <h3 className="text-xl font-bold text-black">
              {currentData.username}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentData.full_name}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 transition-transform"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <p className="text-sm font-bold text-muted-foreground">Age</p>
            <p className="font-bold text-black">
              {currentData.age}
            </p>
          </div>
          <div className="flex justify-between items-center pt-1">
            <p className="text-sm font-bold text-muted-foreground">Gender</p>
            <p className="font-bold text-black capitalize">
              {currentData.gender}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Username
        </label>
        <input
          {...register("username", { required: true })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Full Name
        </label>
        <input
          {...register("full_name")}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
        {errors.full_name && (
          <p className="text-xs text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Age
        </label>
        <input
          type="number"
          {...register("age", { valueAsNumber: true })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
        {errors.age && (
          <p className="text-xs text-red-500">{errors.age.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Gender
        </label>
        <select
          {...register("gender")}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none"
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-xs text-red-500">{errors.gender.message}</p>
        )}
      </div>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-transparent p-3.5 text-sm font-bold text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <X className="h-5 w-5" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary p-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
        >
          <Check className="h-5 w-5" /> {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
