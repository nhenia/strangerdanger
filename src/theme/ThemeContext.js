import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { themes } from './themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('pager');

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    VT323_400Regular,
  });

  const theme = themes[themeId] || themes.pager;

  if (!fontsLoaded) {
    return null; // Or a simple loader
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeId, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
