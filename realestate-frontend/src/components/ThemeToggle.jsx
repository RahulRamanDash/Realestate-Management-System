import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { getPreferredTheme, setThemePreference } from "../utils/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    setTheme(getPreferredTheme());
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => setThemePreference(currentTheme === "dark" ? "light" : "dark"));
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      title={`Switch to ${isLight ? "dark" : "light"} theme`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span>{isLight ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeToggle;
