import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { loadIsActive, saveIsActive, loadInteractionTypes } from './src/utils/storage';
import { generateHandshake } from './src/utils/scripts';
import AnimatedBackground from './src/components/AnimatedBackground';
import HomeScreen from './src/screens/HomeScreen';
import MatchFound from './src/screens/MatchFound';
import Bridge from './src/screens/Bridge';

const MainApp = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    loadIsActive().then(setIsActive);
  }, []);

  const handleToggleActive = async (val) => {
    setIsActive(val);
    await saveIsActive(val);
  };
  const [matchingState, setMatchingState] = useState('none'); // none, finding, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [handshake, setHandshake] = useState(null);

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

  const handleMatchAccept = async (anchor) => {
    setMyAnchor(anchor);
    // Simulated anchor for the other person
    const sampleAnchors = ['Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table', 'Laptop stickers'];
    const selectedTheirAnchor = sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)];
    setTheirAnchor(selectedTheirAnchor);

    const interactionTypes = await loadInteractionTypes();
    const newHandshake = generateHandshake(interactionTypes, anchor, selectedTheirAnchor);
    setHandshake(newHandshake);

    setMatchingState('bridge');
  };

  const handleDismiss = () => {
    setIsActive(false);
    setMatchingState('none');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <AnimatedBackground />

      {matchingState === 'bridge' ? (
        <Bridge
          myAnchor={myAnchor}
          theirAnchor={theirAnchor}
          handshake={handshake}
          onDismiss={handleDismiss}
        />
      ) : matchingState === 'match_found' ? (
        <MatchFound onAccept={handleMatchAccept} />
      ) : (
        <HomeScreen isActive={isActive} onToggle={handleToggleActive} />
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
