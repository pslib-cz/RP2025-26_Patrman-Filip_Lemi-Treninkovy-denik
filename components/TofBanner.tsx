import { Timer } from "lucide-react";

interface Props {
  tofValue: string;
  setTofValue: (value: string) => void;
  onSave: (tofNum: number) => void;
  onClose: () => void;
}

export function TofBanner({ tofValue, setTofValue, onSave, onClose }: Props) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 relative flex flex-col gap-3">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
      <div className="flex gap-2 items-start">
        <Timer className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-sm text-foreground">
            Max Performance: Time for 10 Jumps
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter your 10-jump max time (Max times) in seconds.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          step="0.1"
          value={tofValue}
          onChange={(e) => setTofValue(e.target.value)}
          placeholder="e.g. 18.5"
          className="flex-1 py-2 text-sm bg-card border border-border text-muted-foreground rounded-lg font-semibold flex items-center justify-center gap-1.5 hover:bg-muted transition-colors shadow-sm"
        />
        <button
          onClick={() => {
            const tofNum = parseFloat(tofValue);
            if (!isNaN(tofNum)) {
              onSave(tofNum);
            }
          }}
          className="px-4 py-1.5 text-sm bg-primary text-white font-semibold rounded-lg hover:bg-orange-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
