import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "system";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  colorScheme: "light",
});

export const ThemeProviderCustom = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemScheme = useColorScheme() ?? "light";
  const [theme, setTheme] = useState<Theme>("system");
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    systemScheme,
  );

  useEffect(() => {
    AsyncStorage.getItem("APP_THEME").then((t) => {
      if (t === "light" || t === "dark" || t === "system") setTheme(t);
    });
  }, []);

  useEffect(() => {
    if (theme === "system") {
      setColorScheme(systemScheme);
    } else {
      setColorScheme(theme);
    }
    AsyncStorage.setItem("APP_THEME", theme);
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => useContext(ThemeContext);
