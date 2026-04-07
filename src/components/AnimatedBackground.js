import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const AnimatedBackground = () => {
  const { theme } = useTheme();

  // Common animations
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background flicker for Pager
    if (theme.id === 'pager') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.1, duration: 50, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0.2, duration: 100, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0.15, duration: 80, useNativeDriver: true }),
        ])
      ).start();
    }

    // Grid move for Vaporwave
    if (theme.id === 'vaporwave') {
      Animated.loop(
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }

    // Floating bokeh for Glass
    if (theme.id === 'glassmorphism') {
        Animated.loop(
            Animated.timing(moveAnim, {
              toValue: 1,
              duration: 8000,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ).start();
    }

    // Moving scanlines for Retro
    if (theme.id === 'retro') {
        Animated.loop(
          Animated.timing(moveAnim, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
    }

    return () => {
      fadeAnim.setValue(0.3);
      moveAnim.setValue(0);
    };
  }, [theme.id]);

  const renderVaporwave = () => (
    <View style={styles.fullScreen}>
      <Animated.View
        style={[
          styles.grid,
          {
            transform: [
              { perspective: 200 },
              { rotateX: '60deg' },
              { translateY: moveAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 40],
              }) }
            ],
          },
        ]}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: i * (width / 9) }]} />
        ))}
      </Animated.View>
    </View>
  );

  const renderPager = () => (
    <Animated.View style={[styles.fullScreen, { backgroundColor: theme.text, opacity: fadeAnim }]} />
  );

  const renderGlass = () => (
    <View style={styles.fullScreen}>
        <Animated.View style={[
            styles.bokeh,
            {
                backgroundColor: theme.accent,
                top: 100,
                left: 50,
                transform: [{
                    translateX: moveAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 100, 0]
                    })
                }, {
                    translateY: moveAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 50, 0]
                    })
                }]
            }
        ]} />
        <Animated.View style={[
            styles.bokeh,
            {
                backgroundColor: theme.secondary,
                bottom: 150,
                right: 30,
                width: 150,
                height: 150,
                transform: [{
                    translateX: moveAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -80, 0]
                    })
                }, {
                    translateY: moveAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -100, 0]
                    })
                }]
            }
        ]} />
    </View>
  );

  const renderRetro = () => (
      <View style={styles.fullScreen}>
          {[0, 1, 2, 3, 4].map((i) => (
              <Animated.View
                key={i}
                style={[
                    styles.scanline,
                    {
                        top: 0,
                        transform: [{
                            translateY: moveAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [i * (height / 5), (i + 1) * (height / 5)]
                            })
                        }]
                    }
                ]}
              />
          ))}
      </View>
  )

  const renderContent = () => {
    switch (theme.id) {
      case 'vaporwave': return renderVaporwave();
      case 'pager': return renderPager();
      case 'glassmorphism': return renderGlass();
      case 'retro': return renderRetro();
      default: return null;
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: -1, overflow: 'hidden' }]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  grid: {
    width: width * 2,
    height: height,
    position: 'absolute',
    bottom: -100,
    left: -width / 2,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 0, 255, 0.3)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 0, 255, 0.3)',
  },
  bokeh: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      opacity: 0.3,
  },
  scanline: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
  }
});

export default AnimatedBackground;
