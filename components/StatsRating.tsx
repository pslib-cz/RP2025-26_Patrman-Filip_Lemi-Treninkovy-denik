import { Star } from "lucide-react";
import { getAverageRating } from "@/services/stats.service";

interface Props {
  filter: string;
  userId: string;
}

export default async function StatsRating({ filter, userId }: Props) {
  const rating = await getAverageRating(userId, filter);
  const formattedRating = rating.toFixed(1);
  const roundedRating = Math.round(rating);

  return (
    <div className="flex flex-col justify-center bg-card rounded-xl p-5 shadow-sm border border-border">
      <h3 className="text-foreground font-bold mb-2">
        Average Training Rating
      </h3>

      <div className="flex items-center gap-3">
        <span className="text-5xl font-bold text-primary">
          {formattedRating}
        </span>

        <div className="flex gap-1 text-primary">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <Star
              key={starIndex}
              className={`h-6 w-6 stroke-[2.5px] transition-colors ${
                starIndex <= roundedRating
                  ? "fill-primary text-primary"
                  : "fill-transparent text-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
