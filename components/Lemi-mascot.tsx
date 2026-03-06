import { cn } from "@/utils/twmerge"

interface LemiMascotProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  expression?: "happy" | "wink" | "excited"
}

export function LemiMascot({ size = "md", className, expression = "happy" }: LemiMascotProps) {
  const sizeClasses = {
    sm: "size-8",
    md: "size-12",
    lg: "size-20",
    xl: "size-32",
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
      aria-hidden="true"
    >
      {/* Body / Head circle */}
      <circle cx="50" cy="52" r="34" fill="#4a4a4a" />
      {/* Face lighter area */}
      <ellipse cx="50" cy="56" rx="24" ry="22" fill="#f5f0eb" />
      {/* Left ear */}
      <ellipse cx="26" cy="24" rx="12" ry="16" fill="#4a4a4a" transform="rotate(-15 26 24)" />
      <ellipse cx="26" cy="24" rx="7" ry="11" fill="#e8a07a" transform="rotate(-15 26 24)" />
      {/* Right ear */}
      <ellipse cx="74" cy="24" rx="12" ry="16" fill="#4a4a4a" transform="rotate(15 74 24)" />
      <ellipse cx="74" cy="24" rx="7" ry="11" fill="#e8a07a" transform="rotate(15 74 24)" />
      {/* Eye patches (dark rings) */}
      <ellipse cx="38" cy="48" rx="10" ry="11" fill="#2a2a2a" />
      <ellipse cx="62" cy="48" rx="10" ry="11" fill="#2a2a2a" />
      {/* Left eye */}
      {expression === "wink" ? (
        <path d="M33 48 Q38 44 43 48" stroke="#f5f0eb" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="38" cy="47" r="5" fill="#f5f0eb" />
          <circle cx="39" cy="46" r="2.5" fill="#1a1a1a" />
          <circle cx="40" cy="45" r="1" fill="#ffffff" />
        </>
      )}
      {/* Right eye */}
      <circle cx="62" cy="47" r="5" fill="#f5f0eb" />
      <circle cx="63" cy="46" r="2.5" fill="#1a1a1a" />
      <circle cx="64" cy="45" r="1" fill="#ffffff" />
      {/* Nose */}
      <ellipse cx="50" cy="57" rx="4" ry="2.5" fill="#2a2a2a" />
      {/* Mouth */}
      {expression === "excited" ? (
        <path d="M42 62 Q50 72 58 62" fill="#e8722a" stroke="#2a2a2a" strokeWidth="1" />
      ) : (
        <path d="M43 62 Q50 68 57 62" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {/* Stripe on head */}
      <path d="M50 18 L50 38" stroke="#f5f0eb" strokeWidth="3" strokeLinecap="round" />
      {/* Orange singlet / chest mark */}
      <path d="M38 70 Q50 80 62 70 L62 85 Q50 92 38 85 Z" fill="#e8722a" />
      {/* Blue stripe on singlet */}
      <path d="M42 76 Q50 83 58 76" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default LemiMascot;