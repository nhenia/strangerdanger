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
      const pulseDuration =
        matchingState === 'scanning' ? 3000 :
        matchingState === 'pinging' ? 1500 :
        matchingState === 'matching' ? 800 : 2000;

      // Pulse animation
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: pulseDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      ).start();

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
      case 'scanning': return theme.lcd ? 'Scanning frequency...' : 'Scanning nearby...';
      case 'pinging': return theme.lcd ? 'Sending pings...' : 'Pinging potential matches...';
      case 'matching': return theme.lcd ? 'Handshaking...' : 'Establishing connection...';
      default: return theme.lcd ? 'Paging nearby...' : 'Searching for matches...';
    }
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
                { height: i * 8, opacity: i <= signalBars ? 1 : 0.2 }
              ]}
            />
          ))}
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>Signal: {signalBars}/5</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.pulse} />
      <Animated.View style={[styles.pulse, { delay: 1000 }]} />
      <Radio color={theme.text} size={48} />
      <Text style={styles.statusText}>{getStatusText()}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>{distance}m away</Text>
    </View>
  );
};

export default Radar;
