import { SessionHistory } from "@/types/training";
import { Star } from "lucide-react";

type SessionCardProps = {
  date: string;
  time: string;
  rating: number;
  difficulty: number;
  rounds: number;
  jumps: number;
  total_routines: number;
  notes: string;
}

export default function SessionCard({ date, time, rating, difficulty, rounds, jumps, total_routines, notes }: SessionCardProps) {
  return (
    <div>
      <div>
        <div>
          <h2>{date}</h2>
          <p>{time}</p> {/* TODO: format time */}
        </div>
        <div className="flex gap-2">
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
    </div>
  );
}
