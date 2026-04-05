import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import MatchFound from './src/screens/MatchFound';
import Bridge from './src/screens/Bridge';
import { getRandomAnchor } from './src/utils/proximity';

const MainApp = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [matchingState, setMatchingState] = useState('none'); // none, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');

  const handleMatchFound = () => {
    setMatchingState('match_found');
  };

  const handleMatchAccept = (anchor) => {
    setMyAnchor(anchor);
    setTheirAnchor(getRandomAnchor());
    setMatchingState('bridge');
  };

  const handleDismiss = () => {
    // "Dissolve" logic: reset everything to silent
    setIsActive(false);
    setMatchingState('none');
    setMyAnchor('');
    setTheirAnchor('');
  };

  const handleToggle = (val) => {
    setIsActive(val);
    if (!val) setMatchingState('none');
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
        <MatchFound
          onAccept={handleMatchAccept}
          onDecline={handleDismiss}
        />
      ) : (
        <HomeScreen
          isActive={isActive}
          onToggle={handleToggle}
          onMatchFound={handleMatchFound}
        />
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
