import { Timer } from "lucide-react";

interface Props {
  tofValue: string;
  setTofValue: (value: string) => void;
  onSave: (tofNum: number) => void;
  onClose: () => void;
}

export function TofBanner({ tofValue, setTofValue, onSave, onClose }: Props) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 relative flex flex-col gap-3">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
      >
        ✕
      </button>
      <div className="flex gap-2 items-start">
        <Timer className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-sm text-slate-900">
            Max Performance: Time for 10 Jumps
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your 10-jump max time (Maximálky) in seconds.
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
          className="flex-1 px-3 py-1.5 text-sm border-2 border-orange-400 rounded-lg focus:outline-none bg-white"
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
