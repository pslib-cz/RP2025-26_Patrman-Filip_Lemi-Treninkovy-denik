"use client";
import { useActionState } from "react";
import { updateProfile } from "../login/actions";

import Lemi from "@/components/Lemi-mascot";

export default function OnboardingPage() {
  const [state, formAction] = useActionState(updateProfile, { error: null });

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
