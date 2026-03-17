import { SessionDetailRounds } from "@/components/SessionDetailRounds";
import { deleteSession, getSessionById } from "@/services/session.service";
import { Round } from "@/types/training";
import {
  Activity,
  AlignVerticalSpaceAround,
  ChevronLeft,
  RotateCcw,
  Star,
  Target,
  Trash2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import SessionMetricsCard from "@/components/SessionMetricsCard";
import { redirect } from "next/navigation";

export default async function SessionByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSessionById(id);

  if (!session) return <div>Training session not found</div>;

  const rounds: Round[] = session.rounds.map((round) => {
    return {
      id: round.id,
      total_difficulty: round.difficulty || 0,
      is_routine: round.is_routine || false,
      routine_type: (round.routine_type as "VS" | "PS") || undefined,
      tof: round.tof || undefined,
      skills: round.fig_string.split(" ").map((figCodeString) => {
        return {
          id: uuidv4(),
          fig_code: figCodeString,
          difficulty: 0,
          tof: figCodeString === "-" ? round.tof || undefined : undefined,
        };
      }),
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-md mx-auto p-4 flex flex-col gap-6 pt-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sessions"
            className="w-10 h-10 border border-slate-200 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-xl text-slate-800">Session Detail</h1>
            <p className="text-sm font-medium text-slate-500">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SessionMetricsCard
            icon={<Activity className="w-4 h-4" />}
            value={session.total_difficulty ?? 0}
            label="Difficulty"
            className="text-primary"
          />

          <SessionMetricsCard
            icon={<AlignVerticalSpaceAround className="w-4 h-4" />}
            value={session.total_jumps || 0}
            label="Jumps"
            className="text-slate-800"
          />

          <SessionMetricsCard
            icon={<RotateCcw className="w-4 h-4" />}
            value={session.total_rounds || 0}
            label="Rounds"
            className="text-slate-800"
          />

          <SessionMetricsCard
            icon={<Target className="w-4 h-4" />}
            value={session.total_routines || 0}
            label="Routines"
            className="text-slate-800"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-600">
              Session Rating
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= (session.rating || 0)
                      ? "fill-primary text-primary"
                      : "fill-slate-100 text-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {session.notes && (
            <div className="mt-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Notes
              </span>
              <p className="text-sm text-slate-700 font-medium italic">
                &quot;{session.notes}&quot;
              </p>
            </div>
          )}
        </div>

        <SessionDetailRounds rounds={rounds} />
        <form
        className="mt-16"
          action={async () => {
            "use server";
            await deleteSession(session.id);
            redirect("/dashboard/sessions");
          }}
        >
          <button
            type="submit"
            className="w-full mt-4 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
            Delete Session
          </button>
        </form>

      </div>
    </div>
  );
}
