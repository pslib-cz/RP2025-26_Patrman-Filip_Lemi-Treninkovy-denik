import { Check, Copy } from "lucide-react";

interface Props {
  onDuplicateRound: () => void;
  onFinishSession: () => void;
}

export function CopyCheckButton({ onDuplicateRound, onFinishSession }: Props) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        onClick={() => onDuplicateRound()}
        className="flex-1 py-2 text-sm bg-card border border-border text-muted-foreground rounded-lg font-semibold flex items-center justify-center gap-1.5 hover:bg-muted transition-colors shadow-sm"
      >
        <Copy className="w-4 h-4" />
        Duplicate Last
      </button>

      <button
        onClick={() => onFinishSession()}
        className="flex-[1.5] py-2 text-sm bg-secondary text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary/80 transition-colors shadow-sm focus:ring-2 focus:ring-secondary focus:outline-none"
      >
        <Check className="w-4 h-4" />
        Finish Session
      </button>
    </div>
  );
}
