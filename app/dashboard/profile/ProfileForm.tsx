"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Edit2, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateProfileData } from "@/services/profile.service"; 

interface ProfileData {
  username: string | null;
  full_name: string | null;
  age: number | null;
  gender: string | null;
}

interface Props {
  initialData: ProfileData | null;
  userId: string | undefined;
}

export function ProfileForm({ initialData, userId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<ProfileData>(
    initialData || { username: "", full_name: "", age: null, gender: "" }
  );

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileData>({
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
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="overflow-hidden flex-1">
            <h3 className="truncate text-xl font-bold text-black">{currentData.username || "Jumper"}</h3>
            <p className="truncate text-sm text-muted-foreground">{currentData.full_name || "No name set"}</p>
          </div>
          {/* Robustní prstové target-tlačítko */}
          <button 
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 transition-transform"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        {/* Read only vizitka se změnila na čistý iPhone Settings list (Pod sebou, s čárou na spodku) */}
        <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <p className="text-sm font-bold text-muted-foreground">Age</p>
                <p className="font-bold text-black">{currentData.age ? `${currentData.age} years` : "-"}</p>
            </div>
            <div className="flex justify-between items-center pt-1">
                <p className="text-sm font-bold text-muted-foreground">Gender</p>
                <p className="font-bold text-black capitalize">{currentData.gender || "-"}</p>
            </div>
        </div>
      </div>
    );
  }

  // Odstraněn dvojitý Grid, mobilní chunky p-3.5 pro masivnější pole
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Username</label>
        <input 
          {...register("username", { required: true })} 
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name</label>
        <input 
          {...register("full_name")} 
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Age</label>
        <input 
          type="number" 
          {...register("age", { valueAsNumber: true })} 
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Gender</label>
        <select 
          {...register("gender")} 
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-black focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none"
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
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
