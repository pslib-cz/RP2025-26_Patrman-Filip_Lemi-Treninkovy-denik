import { Search, SlidersHorizontal } from "lucide-react";


interface Props {
    searchQuery: string;
    timeFilter: string;
    onTimeFilter: (time: string) => void;
    onSearchQuery: (search: string) => void;
}

export default function Filter({searchQuery, timeFilter, onTimeFilter, onSearchQuery}: Props) {
    return(
        <div className="relative mb-6 flex gap-2">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search skills or dates..."
              value={searchQuery}
              onChange={(e) => {
                onSearchQuery(e.target.value);
              }}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground shadow-sm transition-all text-foreground"
            />
            <div className="relative w-[52px] h-[50px] bg-card border border-border rounded-xl shadow-sm flex items-center justify-center shrink-0">
              <SlidersHorizontal
                className={`w-5 h-5 ${timeFilter === "all" ? "text-muted-foreground" : "text-primary"}`}
              />
              <select
                value={timeFilter}
                onChange={(e) => onTimeFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
    )
}