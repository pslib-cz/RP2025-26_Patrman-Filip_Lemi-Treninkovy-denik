'use client'

import { usePathname, useSearchParams,  useRouter } from "next/navigation";

const FILTER_OPTIONS = [
    { id: "all", label: "All Time" },
    { id: "year", label: "Year" },
    { id: "month", label: "Month" }
]

export default function StatsTimeFilter(){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("time") || "all";

    const updateFilter = (time: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("time", time)
        router.replace(`${pathname}?${params}`)
    }

    return (
        <div className="flex gap-2">
            {FILTER_OPTIONS.map((option) => {
                const isActive = currentFilter === option.id;
                return (
                    <button 
                        key={option.id}
                        onClick={() => updateFilter(option.id)}
                        className={`
                            hover:cursor-pointer hover:scale-105 transition-transform text-sm font-semibold rounded-lg px-3 py-1 
                            ${isActive 
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-500"
                            }
                        `}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}