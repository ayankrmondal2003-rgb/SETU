import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const AppearanceControls: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { translate } = useTranslation();
  const label = translate(theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher />
      <button type="button" aria-label={label} title={label} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-brand-gold/40 bg-cream text-brand-brown shadow-sm hover:ring-2 hover:ring-brand-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
};
