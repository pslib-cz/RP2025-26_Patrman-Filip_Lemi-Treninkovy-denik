"use client";
import { useState } from "react";
import { BookOpen, X } from "lucide-react";

const GUIDE_SECTIONS = [
  {
    title: "How to Log",
    items: [
      { label: "Type FIG code, then press Space or Enter to add" },
      { label: "Skills are added one by one to build a round" },
    ],
  },
  {
    title: "Special Inputs",
    items: [
      { code: "-", label: "Record your max time of flight (ToF)" },
      { code: "/", label: "Straight jump" },
    ],
  },
  {
    title: "Direction Prefix",
    items: [
      { code: "F", label: "Forward (e.g. F40/)" },
      { code: "B", label: "Backward (e.g. B40/)" },
      { label: "No prefix → auto-detected from your skills" },
    ],
  },
];

const COMMON_CODES = [
  { code: "B40o", name: "Back somersault tuck" },
  { code: "F41/", name: "Barani straight" },
  { code: "B42/", name: "Full" },
  { code: "F801o", name: "Half out tuck" },
];

export default function LogGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 rounded-xl bg-card border border-border 
                   flex items-center justify-center hover:bg-muted 
                   transition-colors"
      >
        <BookOpen className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start 
                     justify-center pt-16 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-5 
                       max-w-sm w-full max-h-[75vh] overflow-y-auto 
                       shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">Log Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-muted flex items-center 
                           justify-center hover:bg-muted-foreground/20 
                           transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-4">
              {GUIDE_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {section.title}
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 
                                              text-sm text-muted-foreground"
                      >
                        {item.code && (
                          <span
                            className="font-mono font-bold text-primary 
                                          bg-primary/10 px-1.5 rounded shrink-0"
                          >
                            {item.code}
                          </span>
                        )}
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Common Codes Table */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Common Codes
                </h3>
                <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1.5">
                  {COMMON_CODES.map((skill) => (
                    <div
                      key={skill.code}
                      className="flex justify-between 
                                                     text-sm"
                    >
                      <span className="font-mono font-bold text-foreground">
                        {skill.code}
                      </span>
                      <span className="text-muted-foreground">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
