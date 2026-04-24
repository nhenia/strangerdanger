import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

const MoodRing = ({ mood }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulseAnim.stopAnimation();
    if (!mood || mood === 'none') {
      pulseAnim.setValue(0);
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        })
      ])
    ).start();
  }, [mood, pulseAnim]);

  if (!mood || mood === 'none') {
    return null;
  }

  const getMoodColor = () => {
    switch (mood) {
      case 'red': return '#FF0000'; // Pure Red
      case 'yellow': return '#FFFF00'; // Pure Yellow
      case 'green': return '#00FF00'; // Pure Green
      default: return 'transparent';
    }
  };

  const color = getMoodColor();

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: color,
            shadowColor: color,
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            shadowOpacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Ensure it's on top of everything
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 20, // For Android
  }
});

export default MoodRing;
