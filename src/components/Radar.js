import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Radio, Loader2 } from 'lucide-react-native';

const Radar = ({ isActive, matchingState, distance, signalStrength }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Adjusted pulse duration based on signal strength
    const duration = 2000 / (signalStrength || 1);

    const pulseAction = Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: Math.max(500, duration),
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );

    pulseAction.start();

    const rotateAction = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAction.start();

    return () => {
      pulseAnim.setValue(0);
      rotateAnim.setValue(0);
      pulseAction.stop();
      rotateAction.stop();
    };
  }, [signalStrength]);

  useEffect(() => {
    if (matchingState === 'approaching') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (matchingState === 'locking') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (matchingState === 'match_found') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [matchingState]);

  const getStatusText = () => {
    switch (matchingState) {
      case 'searching': return 'Searching nearby...';
      case 'approaching': return 'Signal detected...';
      case 'locking': return 'Establishing connection...';
      case 'match_found': return 'Match found!';
      default: return 'Initializing...';
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
                { height: i * 8, opacity: i <= signalStrength ? 1 : 0.2 }
              ]}
            />
          ))}
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>
          Signal: {signalStrength}/5 | {distance.toFixed(1)}m
        </Text>
      </View>
    );
  }

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={styles.pulse} />
      <Animated.View style={[
        styles.pulse,
        {
            transform: [{ scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1.5],
            }) }],
            opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 0],
            }),
        }
      ]} />

      {matchingState === 'locking' ? (
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Loader2 color={theme.accent} size={48} />
        </Animated.View>
      ) : (
        <Radio color={theme.text} size={48} />
      )}

      <Text style={styles.statusText}>{getStatusText()}</Text>
      <Text style={[styles.statusText, { fontSize: 14, opacity: 0.8 }]}>
        {distance.toFixed(1)}m away
      </Text>
    </View>
  );
};

export default Radar;
