
import { Logo } from './logo';

const NUM_LINES = 12; // Number of lines to radiate out

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="relative flex items-center justify-center">
        {/* Animated radiating lines */}
        <div className="absolute w-64 h-64 md:w-80 md:h-80">
          {Array.from({ length: NUM_LINES }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 h-0.5 w-1/2 origin-left bg-gradient-to-r from-primary to-accent animate-radiate-out"
              style={{
                transform: `rotate(${i * (360 / NUM_LINES)}deg)`,
                animationDelay: `${i * 150}ms`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
        
        {/* Logo with breathing animation */}
        <div className="light-sweep-logo animate-breathing-logo">
          <Logo className="w-64 md:w-80 h-auto text-foreground" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
