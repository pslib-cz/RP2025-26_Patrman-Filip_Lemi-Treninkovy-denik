import { Clock } from "lucide-react";

type TrainingData = {
  id: number;
  date: string;
  time: string;
  rounds: number;
  jumps: number;
  diff: number;
};

export default function TrainingCard({ data }: { data: TrainingData }) {
  const dayNumber = data.date.split(" ").pop();

  return (
    <div className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center text-primary font-bold rounded-xl bg-accent">
          <span>{dayNumber}</span>
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{data.date}</span>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {data.time} / {data.rounds} rounds / {data.jumps} jumps
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-3 py-1 font-bold border border-border rounded-xl">
        {data.diff.toFixed(1)}
      </div>
    </div>
  );
}
