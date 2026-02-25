import { useEffect } from "react";

const ThemeToggle = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return null;
};

export default ThemeToggle;
