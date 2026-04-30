import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Radio, MapPin, Zap, UserPlus } from 'lucide-react-native';

const Radar = ({ isActive, distance = 100, signalStrength = 1 }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Pulse animation
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      ).start();

      return () => {
        pulseAnim.setValue(0);
      };
    }
  }, [isActive]);

  const getProximityLabel = (dist) => {
    if (dist <= 2) return 'Touching Distance';
    if (dist <= 5) return 'Immediate Proximity';
    if (dist <= 15) return 'Nearby';
    if (dist <= 50) return 'In Range';
    return 'Scanning Area';
  };

  const getProximityIcon = (dist) => {
    if (dist <= 5) return <Zap color={theme.accent} size={32} />;
    if (dist <= 15) return <UserPlus color={theme.text} size={32} />;
    return <MapPin color={theme.text} size={32} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
      paddingBottom: 20,
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
    },
    distanceText: {
      fontSize: 14,
      fontFamily: theme.fontFamily,
      color: theme.text,
      opacity: 0.8,
      marginTop: 4,
    },
    labelTag: {
        backgroundColor: theme.secondary + '40',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 12,
    },
    labelText: {
        fontSize: 12,
        color: theme.accent,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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
        <Text style={styles.statusText}>Paging nearby...</Text>
        <Text style={styles.distanceText}>{getProximityLabel(distance)}</Text>
        <View style={styles.labelTag}>
            <Text style={styles.labelText}>Signal: {signalStrength}/5</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.pulse} />
      <Animated.View style={[styles.pulse, { delay: 1000 }]} />
      {getProximityIcon(distance)}
      <Text style={styles.statusText}>{getProximityLabel(distance)}</Text>
      <Text style={styles.distanceText}>{distance}m away</Text>
      <View style={styles.labelTag}>
        <Text style={styles.labelText}>Pulse Active</Text>
      </View>
    </View>
  );
};

export default Radar;
