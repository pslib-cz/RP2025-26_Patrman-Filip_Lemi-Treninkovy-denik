"use client";
import SessionCard from "@/components/SessionCard";
import { SessionHistory } from "@/types/training";
import { useState } from "react";
import Link from "next/link";
import Filter from "@/components/Filter";

interface Props {
  sessions: SessionHistory[];
}

export default function SessionClient({ sessions }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(5);
  const [timeFilter, setTimeFilter] = useState("all");

  const now = new Date();
  const lowerQuery = searchQuery.toLowerCase();
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  });
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const filteredSessions = sessions.filter((session) => {
    const dateObj = new Date(session.date);

    if (!checkTimeFilter(dateObj, timeFilter, now, weekAgo)) return false;

    return checkSearchMatch(session, lowerQuery, dateFormatter, dateObj);
  });

  const displayedSessions = filteredSessions.slice(0, displayCount);
  return (
    <div className="pb-14 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto w-full pt-6 px-4 flex flex-col gap-4">
        <h1 className="font-bold text-2xl text-foreground">
          Training Sessions
        </h1>
        <div>
          <Filter
            onSearchQuery={(search) => {
              setSearchQuery(search);
              setDisplayCount(5);
            }}
            onTimeFilter={(time) => {
              setDisplayCount(5);
              setTimeFilter(time);
            }}
            searchQuery={searchQuery}
            timeFilter={timeFilter}
          />
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            {displayedSessions.map((rawSession) => {
              const dateObj = new Date(rawSession.date);

              const formattedDate = new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              }).format(dateObj);

              const formattedTime = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }).format(dateObj);
              return (
                <Link
                  href={`/dashboard/sessions/${rawSession.id}`}
                  key={rawSession.id}
                >
                  <SessionCard
                    date={formattedDate}
                    time={formattedTime}
                    rating={rawSession.rating || 0}
                    difficulty={rawSession.total_difficulty || 0}
                    rounds={rawSession.total_rounds || 0}
                    jumps={rawSession.total_jumps || 0}
                    total_routines={rawSession.total_routines || 0}
                    notes={rawSession.notes || ""}
                  />
                </Link>
              );
            })}
            {displayCount < filteredSessions.length && (
              <button
                onClick={() => setDisplayCount(displayCount + 10)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground shadow-sm transition-all md:col-span-2"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function checkTimeFilter(
  dateObj: Date,
  timeFilter: string,
  now: Date,
  weekAgo: Date,
) {
  if (timeFilter === "day") {
    if (dateObj.getDate() !== now.getDate()) return false;
    if (dateObj.getMonth() !== now.getMonth()) return false;
    if (dateObj.getFullYear() !== now.getFullYear()) return false;
  }
  if (timeFilter === "week") {
    if (dateObj < weekAgo) return false;
  }
  if (timeFilter === "month") {
    if (
      dateObj.getMonth() !== now.getMonth() ||
      dateObj.getFullYear() !== now.getFullYear()
    )
      return false;
  }
  if (timeFilter === "3months") {
    const monthsDiff =
      (now.getFullYear() - dateObj.getFullYear()) * 12 +
      now.getMonth() -
      dateObj.getMonth();
    if (monthsDiff > 3) return false;
  }
  if (timeFilter === "year") {
    if (dateObj.getFullYear() !== now.getFullYear()) return false;
  }
  return true;
}

function checkSearchMatch(
  session: SessionHistory,
  lowerQuery: string,
  dateFormatter: Intl.DateTimeFormat,
  dateObj: Date,
): boolean {
  const searchStringDateEN = dateFormatter.format(dateObj);
  const searchStringDate = `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
  const matchesDate =
    searchStringDateEN.toLowerCase().includes(lowerQuery) ||
    searchStringDate.includes(lowerQuery);

  const matchesNotes =
    session.notes?.toLowerCase().includes(lowerQuery) || false;

  const matchesSkills = session.rounds.some((round) =>
    round.fig_string.toLowerCase().includes(lowerQuery),
  );

  return matchesDate || matchesNotes || matchesSkills;
}
