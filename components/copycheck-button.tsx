import { Check, Copy } from "lucide-react";

interface Props {
  onDuplicateRound: () => void;
}

export function CopyCheckButton({ onDuplicateRound }: Props) {
  return (
    <div className="mt-4 flex gap-3">
      <button onClick={() => onDuplicateRound()} className="flex-1 py-3 bg-white border border-border text-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
        <Copy className="w-5 h-5" />
        Duplicate Last
      </button>

      <button className="flex-[1.5] py-3 bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-500 transition-colors shadow-sm focus:ring-2 focus:ring-slate-400 focus:outline-none">
        <Check className="w-5 h-5" />
        Finish Session
      </button>
    </div>
  );
}
