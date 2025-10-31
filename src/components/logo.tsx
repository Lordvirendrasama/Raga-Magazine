
import Image from 'next/image';
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
        <Image
          src="/logo.svg"
          alt="Raga Logo"
          fill
          className="object-contain"
          priority
        />
    </div>
  );
};
