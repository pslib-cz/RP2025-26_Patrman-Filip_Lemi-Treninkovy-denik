import { Delete } from "lucide-react";

interface Props {
  onKeyPress: (key: string) => void;
}

type KeyType = {
  label: React.ReactNode;
  value: string;
  colSpan?: number;
  variant?: "default" | "space" | "delete" | "action";
};

const KEYBOARD_ROWS: KeyType[][] = [
  [
    { label: ".", value: "." },
    { label: "F", value: "F" },
    { label: "B", value: "B" },
    { label: "SPACE", value: "SPACE", variant: "space" },
    {
      label: <Delete className="w-5 h-5 mx-auto" />,
      value: "BACKSPACE",
      variant: "delete",
    },
  ],
  [
    { label: "/", value: "/" },
    { label: "-", value: "-" },
    { label: "<", value: "<" },
    { label: "o", value: "o" },
  ],
  [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ],
  [
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
  ],
  [
    { label: "2x", value: "2x", variant: "action" },
    { label: "3x", value: "3x", variant: "action" },
    { label: "4x", value: "4x", variant: "action" },
    { label: "5x", value: "5x", variant: "action" },
  ],
];

function getVariantClasses(variant?: KeyType["variant"]) {
  switch (variant) {
    case "space":
      return "bg-secondary text-secondary-foreground flex-[2] font-semibold";
    case "delete":
      return "bg-destructive text-white flex-1";
    case "action":
      return "bg-card text-primary font-bold hover:bg-muted";
    default:
      return "bg-card text-foreground hover:bg-muted";
  }
}

function SmartKeyboard({ onKeyPress }: Props) {
  return (
    <div className="w-full max-w-md mx-auto bg-background rounded-xl space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground mb-2 font-sans">
        SMART KEYBOARD
      </p>

      {KEYBOARD_ROWS.map((row, btnIndex) => (
        <div key={btnIndex} className="flex gap-2 w-full">
          {row.map((btn, btnIndex) => (
            <button
              key={btnIndex}
              className={`flex-1 min-h-[40px] rounded-lg shadow-sm border border-border 
                                   flex items-center justify-center text-base active:scale-95 transition-transform 
                                   ${getVariantClasses(btn.variant)}`}
              onClick={() => onKeyPress(btn.value)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SmartKeyboard;
