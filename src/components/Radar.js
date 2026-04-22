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
      const animation = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: matchingState === 'pinpointing' ? 1000 : 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      );
      animation.start();

      // Random walk for signal/distance simulation
      const interval = setInterval(() => {
        setSignalBars(prev => {
          if (matchingState === 'broadcasting') return 1;
          if (matchingState === 'pinpointing') return 4 + Math.floor(Math.random() * 2);
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          return Math.max(1, Math.min(5, prev + delta));
        });
        setDistance(prev => {
          if (matchingState === 'broadcasting') return 100;
          if (matchingState === 'pinpointing') return 5 + Math.floor(Math.random() * 5);
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to 2
          return Math.max(1, Math.min(100, prev + delta));
        });
      }, 1500);

      return () => {
        animation.stop();
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

  const getStatusMessage = () => {
    switch (matchingState) {
      case 'broadcasting':
        return theme.lcd ? 'Initializing pager...' : 'Broadcasting presence...';
      case 'scanning':
        return theme.lcd ? 'Paging nearby...' : 'Scanning for peers...';
      case 'pinpointing':
        return theme.lcd ? 'Signal locked...' : 'Pinpointing match...';
      default:
        return theme.lcd ? 'Paging nearby...' : 'Searching for matches...';
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
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>
          {matchingState === 'broadcasting' ? 'Ready' : `Signal: ${signalBars}/5`}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.pulse} />
      {!theme.lcd && matchingState !== 'pinpointing' && <Animated.View style={[styles.pulse, { delay: 1000 }]} />}
      <Radio color={theme.text} size={48} />
      <Text style={styles.statusText}>{getStatusMessage()}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>
        {matchingState === 'broadcasting' ? 'Establishing frequency' : `${distance}m away`}
      </Text>
    </View>
  );
};

export default Radar;
