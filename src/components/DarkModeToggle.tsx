import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';
import { cn } from '@/lib/utils';

export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={cn(
        "relative h-9 w-9 p-0 transition-all duration-300 hover:scale-110",
        isDark 
          ? "text-primary-foreground hover:bg-primary/20" 
          : "text-foreground hover:bg-muted"
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className={cn(
        "h-4 w-4 rotate-0 scale-100 transition-all duration-300 absolute text-amber-400",
        isDark ? "opacity-100" : "opacity-0 rotate-90"
      )} />
      <Moon className={cn(
        "h-4 w-4 transition-all duration-300 text-blue-400",
        isDark ? "opacity-0 -rotate-90" : "opacity-100"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}