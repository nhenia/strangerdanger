import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Radio, Search, Zap, Handshake } from 'lucide-react-native';

const Radar = ({ matchingState, distance, signalStrength }) => {
  const { theme } = useTheme();
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (anim, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(pulse1, 0);
    const anim2 = createAnimation(pulse2, 1000);

    anim1.start();
    anim2.start();

    return () => {
      anim1.stop();
      anim2.stop();
      pulse1.setValue(0);
      pulse2.setValue(0);
    };
  }, []);

  const getStatusText = () => {
    switch (matchingState) {
      case 'searching': return 'Searching for signals...';
      case 'detecting': return 'Signal detected...';
      case 'handshaking': return 'Establishing handshake...';
      case 'match_found': return 'Proximity Confirmed!';
      default: return 'Initializing...';
    }
  };

  const getIcon = () => {
    const props = { color: theme.text, size: 48 };
    switch (matchingState) {
      case 'searching': return <Search {...props} />;
      case 'detecting': return <Radio {...props} />;
      case 'handshaking': return <Zap {...props} />;
      case 'match_found': return <Handshake {...props} />;
      default: return <Radio {...props} />;
    }
  };

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

  const getPulseStyle = (anim) => ({
    transform: [{
      scale: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 2],
      })
    }],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
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
                { height: i * 8, opacity: i <= signalStrength ? 1 : 0.2 }
              ]}
            />
          ))}
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>
            Signal: {signalStrength}/5 | {distance}m
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulse, getPulseStyle(pulse1)]} />
      <Animated.View style={[styles.pulse, getPulseStyle(pulse2)]} />
      {getIcon()}
      <Text style={styles.statusText}>{getStatusText()}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>{distance}m away</Text>
    </View>
  );
};

export default Radar;
