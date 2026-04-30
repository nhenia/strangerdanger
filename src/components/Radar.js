import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Radio } from 'lucide-react-native';

const Radar = ({ isActive, matchingState }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [signalBars, setSignalBars] = useState(1);
  const [distance, setDistance] = useState(100); // meters

  useEffect(() => {
    if (isActive) {
      // Pulse animation
      let duration = 2000;
      if (matchingState === 'signal_found') duration = 1000;
      if (matchingState === 'connecting') duration = 500;

      const pulse = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      );

      pulse.start();

      // Random walk for signal/distance simulation
      const interval = setInterval(() => {
        setSignalBars(prev => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          return Math.max(1, Math.min(5, prev + delta));
        });
        setDistance(prev => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to 2
          return Math.max(1, Math.min(100, prev + delta));
        });
      }, 1500);

      return () => {
        pulseAnim.setValue(0);
        pulse.stop();
        clearInterval(interval);
      };
    }
  }, [isActive, matchingState]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    pulse: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: theme.accent,
      transform: [{ scale: pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 2],
      }) }],
      opacity: pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 0],
      }),
    },
    pagerSignal: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 40,
      gap: 4,
    },
    bar: {
      width: 8,
      backgroundColor: theme.accent,
      borderRadius: 1,
    },
    statusText: {
      marginTop: 20,
      fontSize: 18,
      fontFamily: theme.fontFamily,
      color: theme.text,
      textAlign: 'center',
    }
  });

  const getStatusText = () => {
    switch (matchingState) {
      case 'searching': return theme.lcd ? 'Paging nearby...' : 'Searching for matches...';
      case 'signal_found': return 'Signal detected...';
      case 'connecting': return 'Establishing handshake...';
      case 'match_found': return 'Match found!';
      default: return theme.lcd ? 'Paging nearby...' : 'Searching for matches...';
    }
  };

  const getDistanceText = () => {
    if (matchingState === 'connecting') return 'Syncing...';
    if (matchingState === 'signal_found') return 'Very close';
    return `${distance}m away`;
  };

  if (theme.lcd) {
    return (
      <View style={styles.container}>
        <View style={styles.pagerSignal}>
          {[1, 2, 3, 4, 5].map(i => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  height: i * 8,
                  opacity: i <= signalBars ? 1 : 0.2,
                  backgroundColor: matchingState === 'connecting' ? theme.accent : theme.secondary
                }
              ]}
            />
          ))}
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>
            {matchingState === 'searching' ? `Signal: ${signalBars}/5` : 'CONNECTED'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.pulse,
        { borderColor: matchingState === 'connecting' ? theme.accent : theme.secondary }
      ]} />
      <Radio color={matchingState === 'connecting' ? theme.accent : theme.text} size={48} />
      <Text style={styles.statusText}>{getStatusText()}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>{getDistanceText()}</Text>
    </View>
  );
};

export default Radar;
