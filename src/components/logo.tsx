
import Image from 'next/image';
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Raga Logo"
      width={100}
      height={36}
      className={cn(className)}
      priority
    />
  );
};
