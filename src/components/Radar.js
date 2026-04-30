import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Radio } from 'lucide-react-native';

const Radar = ({ isActive, matchingState }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const [signalBars, setSignalBars] = useState(1);
  const [distance, setDistance] = useState(100); // meters

  const getStatusConfig = () => {
    switch (matchingState) {
      case 'searching':
        return {
          text: theme.lcd ? 'Paging nearby...' : 'Searching for matches...',
          duration: 3000,
          minBars: 1,
          maxBars: 2,
          minDist: 70,
          maxDist: 100
        };
      case 'detecting':
        return {
          text: theme.lcd ? 'Signal detected' : 'Faint signal detected...',
          duration: 2000,
          minBars: 2,
          maxBars: 3,
          minDist: 40,
          maxDist: 70
        };
      case 'approaching':
        return {
          text: theme.lcd ? 'Approaching...' : 'Target approaching...',
          duration: 1000,
          minBars: 4,
          maxBars: 5,
          minDist: 5,
          maxDist: 30
        };
      default:
        return {
          text: theme.lcd ? 'Paging nearby...' : 'Searching for matches...',
          duration: 2000,
          minBars: 1,
          maxBars: 5,
          minDist: 1,
          maxDist: 100
        };
    }
  };

  const config = getStatusConfig();

  useEffect(() => {
    if (isActive) {
      // Pulse animation
      pulseAnim.setValue(0);
      pulseAnim2.setValue(0);

      const createPulseLoop = (anim, delay = 0) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: config.duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            })
          ])
        );
      };

      const loop1 = createPulseLoop(pulseAnim);
      const loop2 = createPulseLoop(pulseAnim2, config.duration / 2);

      loop1.start();
      loop2.start();

      // Random walk for signal/distance simulation
      const interval = setInterval(() => {
        setSignalBars(prev => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          let next = prev + delta;
          return Math.max(config.minBars, Math.min(config.maxBars, next));
        });
        setDistance(prev => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to 2
          let next = prev + delta;
          // Slowly move towards the range if outside
          if (next > config.maxDist) next -= 2;
          if (next < config.minDist) next += 2;
          return Math.max(1, Math.min(100, next));
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        loop1.stop();
        loop2.stop();
      };
    }
  }, [isActive, matchingState, config.duration]);

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
        <Text style={styles.statusText}>{config.text}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>Signal: {signalBars}/5</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulse, {
        transform: [{ scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 2],
        }) }],
        opacity: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 0],
        }),
      }]} />
      <Animated.View style={[styles.pulse, {
        transform: [{ scale: pulseAnim2.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 2],
        }) }],
        opacity: pulseAnim2.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 0],
        }),
      }]} />
      <Radio color={theme.text} size={48} />
      <Text style={styles.statusText}>{config.text}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>{distance}m away</Text>
    </View>
  );
};

export default Radar;
