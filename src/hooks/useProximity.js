import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 *
 * States:
 * - none: App is not active
 * - searching: Actively looking for signals (Distance: 50-100m)
 * - detecting: Signal found, establishing contact (Distance: 10-50m)
 * - handshaking: Very close, preparing handshake (Distance: 1-10m)
 * - match_found: Proximity established, user must confirm
 * - bridge: Handshake complete
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none');
  const [distance, setDistance] = useState(100);
  const [signalStrength, setSignalStrength] = useState(0); // 0-5
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    let timer;
    let interval;

    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('searching');
        setDistance(100);
        setSignalStrength(1);
      }

      if (matchingState === 'searching') {
        timer = setTimeout(() => {
          setMatchingState('detecting');
        }, 3000 + Math.random() * 2000);
      } else if (matchingState === 'detecting') {
        timer = setTimeout(() => {
          setMatchingState('handshaking');
        }, 3000 + Math.random() * 2000);
      } else if (matchingState === 'handshaking') {
        timer = setTimeout(() => {
          setMatchingState('match_found');
        }, 2000 + Math.random() * 2000);
      }

      // Dynamic data simulation
      interval = setInterval(() => {
        setDistance(prev => {
          let target;
          if (matchingState === 'searching') target = 75;
          else if (matchingState === 'detecting') target = 30;
          else if (matchingState === 'handshaking') target = 5;
          else if (matchingState === 'match_found') target = 2;
          else return prev;

          const delta = (target - prev) * 0.1 + (Math.random() * 2 - 1);
          return Math.max(1, Math.min(100, prev + delta));
        });

        setSignalStrength(prev => {
          let base;
          if (matchingState === 'searching') base = 1;
          else if (matchingState === 'detecting') base = 3;
          else if (matchingState === 'handshaking') base = 4;
          else if (matchingState === 'match_found') base = 5;
          else return 0;

          const variation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return Math.max(1, Math.min(5, base + variation));
        });
      }, 1000);

    } else {
      setMatchingState('none');
      setDistance(100);
      setSignalStrength(0);
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isActive, matchingState]);

  const acceptMatch = useCallback((anchor, interactionTypes, generateHandshakeCallback) => {
    setMyAnchor(anchor);

    // Simulated anchor for the other person
    const sampleAnchors = ['Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table', 'Laptop stickers', 'Yellow bag', 'Silver Watch', 'Black Umbrella'];
    const selectedTheirAnchor = sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)];
    setTheirAnchor(selectedTheirAnchor);

    if (generateHandshakeCallback) {
        const handshake = generateHandshakeCallback(interactionTypes, anchor, selectedTheirAnchor);
        setMatchData(handshake);
    }

    setMatchingState('bridge');
  }, []);

  const reset = useCallback(() => {
    setMatchingState('none');
    setDistance(100);
    setSignalStrength(0);
    setMyAnchor('');
    setTheirAnchor('');
    setMatchData(null);
  }, []);

  return {
    matchingState,
    distance: Math.round(distance),
    signalStrength,
    myAnchor,
    theirAnchor,
    matchData,
    acceptMatch,
    reset
  };
};
