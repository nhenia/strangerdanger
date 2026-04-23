import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { themes } from './themes';
import { loadThemeId, saveThemeId } from '../utils/storage';

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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeId: changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export const useTheme = () => useContext(ThemeContext);
