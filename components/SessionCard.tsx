import { SessionHistory } from "@/types/training";
import { Clock, Star } from "lucide-react";

type SessionCardProps = {
  date: string;
  time: string;
  rating: number;
  difficulty: number;
  rounds: number;
  jumps: number;
  total_routines: number;
  notes: string;
};

export default function SessionCard({
  date,
  time,
  rating,
  difficulty,
  rounds,
  jumps,
  total_routines,
  notes,
}: SessionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4 max-w-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold">{date}</h2>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <p className="text-sm text-slate-500">{time}</p>
          </div>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <div
              key={starIndex}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  starIndex <= rating
                    ? "fill-primary text-primary"
                    : "fill-transparent text-slate-300"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-sm font-medium text-slate-500">
        <p><span className="font-bold text-primary">{difficulty}</span> Diff</p>
        <p><span className="font-bold text-black">{rounds}</span> Rounds</p>
        <p><span className="font-bold text-black">{jumps}</span> Jumps</p>
        <p><span className="font-bold text-black">{total_routines}</span> Routines</p>
      </div>
      <div>
        <p className="text-sm text-slate-500 italic">{notes ? `"${notes}"` : "No notes"}</p>
      </div>
    </div>
  );
}
