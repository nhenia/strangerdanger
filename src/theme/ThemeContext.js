import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { themes } from './themes';
import { loadThemeId, saveThemeId } from '../utils/storage';
import { View, Text } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('pager');

  useEffect(() => {
    loadThemeId().then(id => {
      if (id) setThemeId(id);
    });
  }, []);

  const changeTheme = async (id) => {
    setThemeId(id);
    await saveThemeId(id);
  };

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    VT323_400Regular,
  });

  const theme = themes[themeId] || themes.pager;

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff' }}>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeId: changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
