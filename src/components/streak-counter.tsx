
'use client';

import { Flame } from 'lucide-react';
import { useStreak } from '@/hooks/use-streak';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';

export function StreakCounter() {
  const { streak } = useStreak();
  const { user } = useAuth();

  if (streak === 0) {
    return null;
  }
  
  const tooltipMessage = user
    ? `You're on a ${streak}-day reading streak! Keep it up.`
    : 'Log in to save your streak across devices!';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Flame className="h-5 w-5" />
            <span>{streak}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
