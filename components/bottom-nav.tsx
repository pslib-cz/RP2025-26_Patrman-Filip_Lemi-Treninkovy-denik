"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  ClipboardList,
  Dumbbell,
  BarChart2,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Log", href: "/dashboard/log", icon: BookOpen },
  { name: "Sessions", href: "/dashboard/sessions", icon: ClipboardList },
  { name: "Skills", href: "/dashboard/skills", icon: Dumbbell },
  { name: "Stats", href: "/dashboard/stats", icon: BarChart2 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t bg-background pb-safe">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive
                  ? "text-primary hover:text-muted-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
