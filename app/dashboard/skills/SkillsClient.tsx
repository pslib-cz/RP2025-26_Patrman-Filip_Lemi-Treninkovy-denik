"use client";
import Filter from "@/components/Filter";
import SkillsCard from "@/components/SkillsCard";
import { SkillLibrary } from "@/types/training";
import { useState } from "react";

interface Props {
  skills: SkillLibrary[];
}

export default function SkillsClient({ skills }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(5);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const statusPriority = {
    mastered: 1,
    learning: 2,
    not_started: 3,
  };
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
  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-md mx-auto p-3 pt-4 flex flex-col gap-4">
        <h1 className="font-bold text-2xl text-foreground">Skills</h1>
        <Filter
          onTimeFilter={(search) => {
            setTimeFilter(search);
            setDisplayCount(5);
          }}
          onStatusFilter={(status) => {
            setStatusFilter(status);
            setDisplayCount(5);
          }}
          onSearchQuery={(search) => {
            setSearchQuery(search);
            setDisplayCount(5);
          }}
          searchQuery={searchQuery}
          timeFilter={timeFilter}
          statusFilter={statusFilter}
        />
        <div className="flex flex-col gap-2">
          {[...skills]
            .filter((skill) =>
              checkSkillSearchMatch(skill, lowerQuery, dateFormatter),
            )
            .filter((skill) => checkTimeFilter(skill, timeFilter, now, weekAgo))
            .filter(
              (skill) =>
                statusFilter === "all" || skill.status === statusFilter,
            )
            .sort((a, b) => statusPriority[a.status] - statusPriority[b.status])
            .map((skill) => (
              <SkillsCard key={skill.id} skill={skill} />
            ))}
        </div>
      </div>
    </div>
  );
}

function checkSkillSearchMatch(
  skill: SkillLibrary,
  lowerQuery: string,
  dateFormatter: Intl.DateTimeFormat,
): boolean {
  const matchesName = skill.name.toLowerCase().includes(lowerQuery);

  const matchesCode = skill.fig_code.toLowerCase().includes(lowerQuery);

  let matchesDate = false;
  if (skill.date_mastered) {
    const dateObj = new Date(skill.date_mastered);
    const searchStringDate = dateFormatter.format(dateObj);
    const searchStringDateNUMBER = `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
    matchesDate =
      searchStringDate.toLowerCase().includes(lowerQuery) ||
      searchStringDateNUMBER.includes(lowerQuery);
  }

  return matchesName || matchesCode || matchesDate;
}

function checkTimeFilter(
  skill: SkillLibrary,
  timeFilter: string,
  now: Date,
  weekAgo: Date,
): boolean {
  if (timeFilter === "all") return true;
  const matchTime = skill.date_mastered;
  if (!matchTime) return false;
  const dateObj = new Date(matchTime);
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
  if (timeFilter === "day") {
    if (dateObj.getDate() !== now.getDate()) return false;
    if (dateObj.getMonth() !== now.getMonth()) return false;
    if (dateObj.getFullYear() !== now.getFullYear()) return false;
  }
  if (timeFilter === "week") {
    if (dateObj < weekAgo) return false;
  }
  return true;
}
