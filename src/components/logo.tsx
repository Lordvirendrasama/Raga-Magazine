
import Image from 'next/image';
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
        <Image
          src="/Raag-Projct-e1727231867617.png"
          alt="Raga Logo"
          fill
          className="object-contain"
          priority
        />
    </div>
  );
};
