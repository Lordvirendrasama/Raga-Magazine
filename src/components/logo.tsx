
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 400 60"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("font-headline", className)}
      aria-label="RagaMagazine Logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="48"
        fontWeight="bold"
        letterSpacing="-1"
        fill="url(#logo-gradient)"
      >
        RagaMagazine
      </text>
    </svg>
  );
};
