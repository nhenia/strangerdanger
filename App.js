import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { loadIsActive, saveIsActive, loadInteractionTypes } from './src/utils/storage';
import { generateHandshake } from './src/utils/scripts';
import { useProximity } from './src/hooks/useProximity';
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

  const {
    matchingState,
    myAnchor,
    theirAnchor,
    matchData,
    acceptMatch,
    reset
  } = useProximity(isActive);

  const handleToggleActive = async (val) => {
    setIsActive(val);
    await saveIsActive(val);
  };

  const handleMatchAccept = async (anchor) => {
    const interactionTypes = await loadInteractionTypes();
    acceptMatch(anchor, (my, their) => generateHandshake(interactionTypes, my, their));
  };

  const handleDismiss = () => {
    setIsActive(false);
    reset();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <AnimatedBackground />

      {matchingState === 'bridge' ? (
        <Bridge
          myAnchor={myAnchor}
          theirAnchor={theirAnchor}
          handshake={matchData}
          onDismiss={handleDismiss}
        />
      ) : matchingState === 'match_found' ? (
        <MatchFound onAccept={handleMatchAccept} />
      ) : (
        <HomeScreen isActive={isActive} onToggle={handleToggleActive} matchingState={matchingState} />
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
