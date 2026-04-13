import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Radio } from 'lucide-react-native';

const Radar = ({ isActive, matchingState }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [signalBars, setSignalBars] = useState(1);
  const [distance, setDistance] = useState(100); // meters

  const getStatusInfo = () => {
    switch (matchingState) {
      case 'searching':
        return { text: 'Searching...', color: theme.accent, pulseDuration: 3000, bars: 1, distRange: [80, 100] };
      case 'far':
        return { text: 'Signal detected', color: theme.accent, pulseDuration: 2000, bars: 2, distRange: [50, 80] };
      case 'near':
        return { text: 'Closing in...', color: theme.accent, pulseDuration: 1500, bars: 3, distRange: [20, 50] };
      case 'very_close':
        return { text: 'Immediate vicinity!', color: theme.accent, pulseDuration: 800, bars: 5, distRange: [5, 20] };
      default:
        return { text: 'Paging nearby...', color: theme.accent, pulseDuration: 2000, bars: 1, distRange: [100, 100] };
    }
  };

  const statusInfo = getStatusInfo();

  useEffect(() => {
    if (isActive) {
      // Pulse animation
      const animation = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: statusInfo.pulseDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      );
      animation.start();

      // Update signal and distance based on state
      const interval = setInterval(() => {
        setSignalBars(prev => {
          const target = statusInfo.bars;
          if (prev < target) return prev + 1;
          if (prev > target) return prev - 1;
          return prev;
        });
        setDistance(prev => {
          const [min, max] = statusInfo.distRange;
          if (prev > max) return prev - Math.min(10, prev - max);
          if (prev < min) return prev + Math.min(10, min - prev);
          const delta = Math.floor(Math.random() * 3) - 1; // -1 to 1
          return Math.max(min, Math.min(max, prev + delta));
        });
      }, 1000);

      return () => {
        animation.stop();
        pulseAnim.setValue(0);
        clearInterval(interval);
      };
    }
  }, [isActive, matchingState, statusInfo.pulseDuration]);

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

  if (theme.lcd) {
    return (
      <View style={styles.container}>
        <View style={styles.pagerSignal}>
          {[1, 2, 3, 4, 5].map(i => (
            <View
              key={i}
              style={[
                styles.bar,
                { height: i * 8, opacity: i <= signalBars ? 1 : 0.2 }
              ]}
            />
          ))}
        </View>
        <Text style={styles.statusText}>{statusInfo.text}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>Signal: {signalBars}/5</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.pulse} />
      <Radio color={theme.text} size={48} />
      <Text style={styles.statusText}>{statusInfo.text}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>{distance}m away</Text>
    </View>
  );
};

export default Radar;
