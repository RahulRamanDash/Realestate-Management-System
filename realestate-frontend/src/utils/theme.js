const THEME_STORAGE_KEY = "theme-preference";

export const getPreferredTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" ? "light" : "dark";
};

export const applyTheme = (theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
};

export const setThemePreference = (theme) => {
  const nextTheme = theme === "light" ? "light" : "dark";

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  applyTheme(nextTheme);
  return nextTheme;
};

export const initializeTheme = () => {
  applyTheme(getPreferredTheme());
};
