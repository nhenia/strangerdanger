import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import MatchFound from './src/screens/MatchFound';
import Bridge from './src/screens/Bridge';

const MainApp = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [matchingState, setMatchingState] = useState('none'); // none, finding, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');

  useEffect(() => {
    let timer;
    if (isActive && (matchingState === 'none' || matchingState === 'finding')) {
      if (matchingState === 'none') setMatchingState('finding');

      timer = setTimeout(() => {
        setMatchingState('match_found');
      }, 7000); // 7 seconds delay
    } else if (!isActive) {
      setMatchingState('none');
    }
    return () => clearTimeout(timer);
  }, [isActive, matchingState]);

  const handleMatchAccept = (anchor) => {
    setMyAnchor(anchor);
    // Simulated anchor for the other person
    const sampleAnchors = ['Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table', 'Laptop stickers'];
    setTheirAnchor(sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)]);
    setMatchingState('bridge');
  };

  const handleDismiss = () => {
    setIsActive(false);
    setMatchingState('none');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      {matchingState === 'bridge' ? (
        <Bridge
          myAnchor={myAnchor}
          theirAnchor={theirAnchor}
          onDismiss={handleDismiss}
        />
      ) : matchingState === 'match_found' ? (
        <MatchFound onAccept={handleMatchAccept} />
      ) : (
        <HomeScreen isActive={isActive} onToggle={setIsActive} />
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
