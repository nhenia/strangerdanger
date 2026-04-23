import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, PanResponder } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake, useKeepAwake } from 'expo-keep-awake';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useIdleTimer } from './src/hooks/useIdleTimer';
import { loadIsActive, saveIsActive, loadInteractionTypes, loadMoodRing, saveMoodRing } from './src/utils/storage';
import { generateHandshake } from './src/utils/scripts';
import { useProximity } from './src/hooks/useProximity';
import AnimatedBackground from './src/components/AnimatedBackground';
import MoodRing from './src/components/MoodRing';
import HomeScreen from './src/screens/HomeScreen';
import MatchFound from './src/screens/MatchFound';
import Bridge from './src/screens/Bridge';

const KeepAwakeControl = () => {
  useKeepAwake();
  return null;
};

const MainApp = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [mood, setMood] = useState('none');
  const { isIdle, resetTimer } = useIdleTimer(30000); // 30 seconds idle

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
    })
  ).current;

  useEffect(() => {
    loadIsActive().then(setIsActive);
    loadMoodRing().then(setMood);
  }, []);

  const handleMoodChange = async (newMood) => {
    setMood(newMood);
    await saveMoodRing(newMood);
  };

  const {
    matchingState,
    myAnchor,
    theirAnchor,
    matchData,
    distance,
    signalBars,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: isIdle ? '#000' : theme.background }} {...panResponder.panHandlers}>
      <StatusBar barStyle={isIdle ? 'light-content' : (theme.isDark ? 'light-content' : 'dark-content')} hidden={isIdle} />

      {/* We keep the UI mounted to preserve state, but hide it visually or cover it with absolute view */}
      <View style={{ flex: 1, opacity: isIdle ? 0 : 1 }}>
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
          <HomeScreen isActive={isActive} onToggle={handleToggleActive} mood={mood} onMoodChange={handleMoodChange} />
        )}
      </View>

      {isIdle && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000', zIndex: 9000 }]} />
      )}

      <MoodRing mood={mood} />
      {mood && mood !== 'none' && <KeepAwakeControl />}
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
