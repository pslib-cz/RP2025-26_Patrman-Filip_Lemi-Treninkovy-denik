import { Clock } from "lucide-react";

type TrainingData = {
  id: string;
  date: string;
  time: string;
  rounds: number;
  jumps: number;
  diff: number;
};

export default function TrainingCard({ data }: { data: TrainingData }) {
  const dayNumber = data.date.split(" ").pop();

  return (
    <div className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-primary font-bold text-sm rounded-xl bg-accent">
          <span>{dayNumber}</span>
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">
            {data.date}
          </span>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span>
              {data.time} / {data.rounds} rounds
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-2.5 py-1 text-sm font-bold border border-border rounded-xl">
        {data.diff.toFixed(1)}
      </div>
    </div>
  );
}
