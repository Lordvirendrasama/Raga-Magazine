
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("font-headline", className)}
      aria-label="Raga Logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
        </linearGradient>
      </defs>
      <text
        fontFamily="serif"
        fontSize="50"
        fontWeight="bold"
        fill="url(#logo-gradient)"
      >
        <tspan x="0" y="45">R</tspan>
        <tspan x="35" y="45" fontSize="40">aga</tspan>
      </text>
      {/* Devanagari-inspired decoration */}
      <path
        d="M 60 25 L 120 25"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
      />
    </svg>
  );
};
