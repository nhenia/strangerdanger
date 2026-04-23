import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, PanResponder } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
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

const MainApp = () => {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [mood, setMood] = useState('none');
  const { isIdle, resetTimer } = useIdleTimer(30000); // 30 seconds idle

  // Keep awake conditionally based on whether a mood is active.
  // expo-keep-awake does not accept a boolean param for the hook, so we
  // conditionally call the hook's effects using standard React logic
  // (actually, expo-keep-awake provides activate/deactivate functions)

  // It's cleaner to use the imperative API for conditional keeping awake
  useEffect(() => {
    const keepAwake = async () => {
      const { activateKeepAwakeAsync, deactivateKeepAwake } = await import('expo-keep-awake');
      if (mood && mood !== 'none') {
        await activateKeepAwakeAsync();
      } else {
        await deactivateKeepAwake();
      }
    };
    keepAwake();
  }, [mood]);

  // Only capture touches if we are idle, to wake up without triggering underlying UI.
  // Otherwise, don't capture so normal interaction occurs.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        // We only want to block touches if we are in ambient mode.
        // But we always want to reset the timer.
        // We can't access current `isIdle` state reliably in the initial closure unless we use a ref or depend on it.
        // However, `resetTimer` is stable.
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
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
        <View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000', zIndex: 9000 }]}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => resetTimer()}
        />
      )}

      <MoodRing mood={mood} />
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
