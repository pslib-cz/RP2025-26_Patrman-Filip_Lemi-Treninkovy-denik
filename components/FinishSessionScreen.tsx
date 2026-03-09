import { Star } from "lucide-react";

interface Props {
  rating: number;
  setRating: (rating: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function FinishSessionScreen({
  rating,
  setRating,
  notes,
  setNotes,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="flex flex-col flex-1 gap-6 pt-4 px-4 bg-slate-50/50 items-center justify-center mt-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900">
          How was your session?
        </h2>
        <p className="text-sm text-slate-500">
          Rate your training and add notes.
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => {
              setRating(starIndex);
            }}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                starIndex <= rating
                  ? "fill-primary text-primary"
                  : "fill-transparent text-slate-300"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="w-full space-y-2">
        <label className="text-xs font-semibold text-slate-700">
          Coach&apos;s Notes / Personal Feeling
        </label>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
          placeholder="How did it go? Any observations..."
          className="w-full min-h-[100px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-slate-700"
        />
      </div>

      <div className="w-full space-y-2 pt-2">
        <button
          onClick={onSave}
          disabled={rating === 0}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Session
        </button>

        <button
          onClick={onCancel}
          className="w-full py-2 text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors"
        >
          Back to Editing
        </button>
      </div>
    </div>
  );
}
