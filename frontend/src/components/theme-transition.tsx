import { useEffect, useRef, useState } from "react";

interface ThemeTransitionProps {
  theme: "dark" | "light";
}

export function ThemeTransition({ theme }: ThemeTransitionProps) {
  const [prevTheme, setPrevTheme] = useState(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (theme !== prevTheme) {
      const button = document.querySelector('[aria-label*="Switch to"]') as HTMLButtonElement;
      buttonRef.current = button;
      
      if (button && overlayRef.current) {
        setIsTransitioning(true);
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate the diagonal of the screen as the circle radius
        const maxRadius = Math.sqrt(
          Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
          Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
        );

        overlayRef.current.style.top = `${centerY}px`;
        overlayRef.current.style.left = `${centerX}px`;
        overlayRef.current.style.transform = `scale(${maxRadius / 10})`;
      }

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevTheme(theme);
      }, 500); // Match this with the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [theme, prevTheme]);

  if (!isTransitioning) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed z-50 -translate-x-5 -translate-y-5 w-10 h-10 rounded-full transition-transform duration-500 pointer-events-none ${
        theme === 'dark' ? 'bg-zinc-900' : 'bg-white'
      }`}
      style={{
        transformOrigin: 'center',
      }}
    />
  );
}