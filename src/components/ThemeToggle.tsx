import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeToggleProps {
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ onThemeChange }) => {
  const [theme, setTheme] = useState<Theme>('auto');

  useEffect(() => {
    const savedTheme = localStorage.getItem('worldclock-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('worldclock-theme', theme);
    onThemeChange?.(theme);
    
    if (theme === 'auto') {
      const hour = new Date().getHours();
      const isDark = hour < 6 || hour > 20;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, onThemeChange]);

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Claro' },
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Oscuro' },
    { value: 'auto', icon: <Monitor className="w-4 h-4" />, label: 'Auto' }
  ];

  return (
    <div className="flex bg-minimal-secondary rounded-lg p-1 border border-minimal">
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            theme === value
              ? 'bg-minimal-primary text-minimal-primary shadow-sm'
              : 'text-minimal-secondary hover:text-minimal-primary'
          }`}
          title={label}
        >
          {icon}
          <span className="text-sm hidden sm:inline font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};