"use client";
import SessionCard from "@/components/SessionCard";
import { SessionHistory } from "@/types/training";
import { useState } from "react";

interface Props {
  sessions: SessionHistory[];
}

export default function SessionClient({ sessions }: Props) {
  const [searchQuerry, setSearchQuerry] = useState("");
  const filteredSessions = sessions.filter((sessions) => {
    const matchesDate = sessions.date
      .toLowerCase()
      .includes(searchQuerry.toLowerCase());
    const matchesNotes = sessions.notes
      ?.toLowerCase()
      .includes(searchQuerry.toLowerCase());
    const matchesSkills = sessions.rounds.some((round) =>
      round.fig_string.toLowerCase().includes(searchQuerry.toLowerCase()),
    );

    return matchesDate || matchesNotes || matchesSkills;
  });
  return (
    <div>
      <h1>Training Sessions</h1>
      <div>
        <div>
          <input
            type="text"
            placeholder="Search skills or dates..."
            value={searchQuerry}
            onChange={(e) => setSearchQuerry(e.target.value)}
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div></div>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          {filteredSessions.map((rawSession) => {
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
              <SessionCard
                key={rawSession.id}
                date={formattedDate}
                time={formattedTime}
                rating={rawSession.rating || 0}
                difficulty={rawSession.total_difficulty || 0}
                rounds={rawSession.total_rounds || 0}
                jumps={rawSession.total_jumps || 0}
                total_routines={rawSession.total_routines || 0}
                notes={rawSession.notes || ""}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
