import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 *
 * States:
 * - none: Not active
 * - searching: Looking for someone nearby
 * - approaching: Found someone, signal is getting stronger
 * - match_found: Close enough to initiate handshake
 * - bridge: Handshake established
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none');
  const [signalStrength, setSignalStrength] = useState(0); // 0.0 to 1.0
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    let timer;
    let signalInterval;

    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('searching');
        setSignalStrength(0.1 + Math.random() * 0.1);
      }

      if (matchingState === 'searching') {
        timer = setTimeout(() => {
          setMatchingState('approaching');
        }, 3000 + Math.random() * 2000); // 3-5 seconds to start approaching
      }

      if (matchingState === 'approaching') {
        timer = setTimeout(() => {
          setMatchingState('match_found');
          setSignalStrength(0.9 + Math.random() * 0.1);
        }, 4000 + Math.random() * 3000); // 4-7 seconds to find match
      }

      // Signal strength simulation
      signalInterval = setInterval(() => {
        setSignalStrength(prev => {
          let target = prev;
          if (matchingState === 'searching') target = 0.2;
          if (matchingState === 'approaching') target = 0.6;
          if (matchingState === 'match_found' || matchingState === 'bridge') target = 0.95;

          const delta = (target - prev) * 0.2 + (Math.random() * 0.1 - 0.05);
          return Math.max(0.05, Math.min(1.0, prev + delta));
        });
      }, 1000);

    } else {
      setMatchingState('none');
      setSignalStrength(0);
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(signalInterval);
    };
  }, [isActive, matchingState]);

  const acceptMatch = useCallback((anchor, generateHandshakeCallback) => {
    setMyAnchor(anchor);

    const sampleAnchors = ['Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table', 'Laptop stickers', 'Yellow bag', 'White Headphones', 'Black Hoodie'];
    const selectedTheirAnchor = sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)];
    setTheirAnchor(selectedTheirAnchor);

    if (generateHandshakeCallback) {
        const handshake = generateHandshakeCallback(anchor, selectedTheirAnchor);
        setMatchData(handshake);
    }

    setMatchingState('bridge');
    setSignalStrength(1.0);
  }, []);

  const reset = useCallback(() => {
    setMatchingState('none');
    setSignalStrength(0);
    setMyAnchor('');
    setTheirAnchor('');
    setMatchData(null);
  }, []);

  return {
    matchingState,
    signalStrength,
    myAnchor,
    theirAnchor,
    matchData,
    acceptMatch,
    reset
  };
};
