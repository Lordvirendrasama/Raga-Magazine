
import { Logo } from './logo';
import { Music, Music2, Music3, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

const notes = [
  { Icon: Music, size: 'w-5 h-5', style: { transform: 'rotate(0deg) translateX(60px) rotate(0deg) scale(0.5)', animationDelay: '0s' } },
  { Icon: Music2, size: 'w-6 h-6', style: { transform: 'rotate(45deg) translateX(70px) rotate(-45deg) scale(0.5)', animationDelay: '0.1s' } },
  { Icon: Music3, size: 'w-4 h-4', style: { transform: 'rotate(90deg) translateX(65px) rotate(-90deg) scale(0.5)', animationDelay: '0.2s' } },
  { Icon: Music4, size: 'w-7 h-7', style: { transform: 'rotate(135deg) translateX(75px) rotate(-135deg) scale(0.5)', animationDelay: '0.3s' } },
  { Icon: Music, size: 'w-5 h-5', style: { transform: 'rotate(180deg) translateX(60px) rotate(-180deg) scale(0.5)', animationDelay: '0.4s' } },
  { Icon: Music2, size: 'w-6 h-6', style: { transform: 'rotate(225deg) translateX(70px) rotate(-225deg) scale(0.5)', animationDelay: '0.5s' } },
  { Icon: Music3, size: 'w-4 h-4', style: { transform: 'rotate(270deg) translateX(65px) rotate(-270deg) scale(0.5)', animationDelay: '0.6s' } },
  { Icon: Music4, size: 'w-7 h-7', style: { transform: 'rotate(315deg) translateX(75px) rotate(-315deg) scale(0.5)', animationDelay: '0.7s' } },
];

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
        
        {/* Animated music notes */}
        {notes.map(({ Icon, size, style }, index) => (
          <Icon
            key={index}
            className={cn(
              'absolute text-primary animate-note-pop-out-loader',
              size
            )}
            style={{
              ...style,
              animationDuration: '1.5s',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
        
        {/* Logo with breathing animation */}
        <div className="light-sweep-logo animate-breathing-logo">
          <Logo className="w-48 md:w-56 h-auto text-foreground" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
