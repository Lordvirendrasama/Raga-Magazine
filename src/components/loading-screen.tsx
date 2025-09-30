
import { Logo } from './logo';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="light-sweep-logo">
        <Logo className="w-64 md:w-80 h-auto text-foreground" />
      </div>
    </div>
  );
};

export default LoadingScreen;
