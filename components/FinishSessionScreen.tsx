import { Star } from "lucide-react";

interface Props {
  rating: number;
  setRating: (rating: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function FinishSessionScreen({ rating, setRating, notes, setNotes, onSave, onCancel }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-sm mx-auto mt-8">
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">How was your session?</h2>
        <p className="text-slate-500">Rate your training and add notes.</p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => { setRating(starIndex)}}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star 
              className={`w-10 h-10 transition-colors ${
                starIndex <= rating 
                  ? "fill-primary text-primary"
                  : "fill-transparent text-slate-300"
              }`} 
            />
          </button>
        ))}
      </div>

      <div className="w-full space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Coach&apos;s Notes / Personal Feeling
        </label>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value)}}
          placeholder="How did it go? Any observations..."
          className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-slate-700"
        />
      </div>

      <div className="w-full space-y-3 pt-4">
        <button 
          onClick={onSave}
          disabled={rating === 0}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Session
        </button>
        
        <button 
          onClick={onCancel}
          className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors"
        >
          Back to Editing
        </button>
      </div>
      
    </div>
  );
}
