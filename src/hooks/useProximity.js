import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to simulate proximity detection and matching logic.
 * In a real-world scenario, this would interface with Bluetooth LE or Geolocation APIs.
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none'); // none, broadcasting, scanning, matching, pinpointing, match_found, bridge
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);
  const [distance, setDistance] = useState(100);
  const [signalBars, setSignalBars] = useState(1);

  useEffect(() => {
    let timer;
    let interval;

    if (isActive) {
      if (matchingState === 'none') {
        setMatchingState('broadcasting');
        setDistance(100);
        setSignalBars(1);
      }

      if (matchingState === 'broadcasting') {
        timer = setTimeout(() => {
          setMatchingState('scanning');
        }, 3000);
      }

      if (matchingState === 'scanning') {
        timer = setTimeout(() => {
          setMatchingState('matching');
        }, 4000);
      }

      if (matchingState === 'matching') {
        timer = setTimeout(() => {
          setMatchingState('pinpointing');
        }, 4000);
      }

      if (matchingState === 'pinpointing') {
        timer = setTimeout(() => {
          setMatchingState('match_found');
          setDistance(0);
          setSignalBars(5);
        }, 5000);
      }

      // Random walk for signal/distance simulation based on state
      interval = setInterval(() => {
        setSignalBars(prev => {
          let min = 1, max = 5;
          if (matchingState === 'broadcasting') { min = 1; max = 1; }
          else if (matchingState === 'scanning') { min = 1; max = 2; }
          else if (matchingState === 'matching') { min = 2; max = 3; }
          else if (matchingState === 'pinpointing') { min = 4; max = 5; }
          else if (matchingState === 'match_found') { min = 5; max = 5; }

          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          return Math.max(min, Math.min(max, prev + delta));
        });

        setDistance(prev => {
          if (matchingState === 'broadcasting') return 100;
          if (matchingState === 'match_found') return 0;

          let target = 100;
          if (matchingState === 'scanning') target = 50;
          else if (matchingState === 'matching') target = 20;
          else if (matchingState === 'pinpointing') target = 5;

          const step = (prev - target) * 0.1;
          const noise = Math.random() * 2 - 1;
          return Math.max(target, Math.round(prev - step + noise));
        });
      }, 1500);
    } else {
      setMatchingState('none');
      setMyAnchor('');
      setTheirAnchor('');
      setMatchData(null);
      setDistance(100);
      setSignalBars(1);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isActive, matchingState]);

  const acceptMatch = useCallback((anchor, generateHandshakeCallback) => {
    setMyAnchor(anchor);

    // Simulated anchor for the other person
    const sampleAnchors = [
      'Blue Book', 'Red Cap', 'Green Scarf', 'Corner Table',
      'Laptop stickers', 'Yellow bag', 'Silver Watch', 'Denim Jacket',
      'White Headphones', 'Coffee cup', 'Black umbrella', 'Patterned tote'
    ];
    const selectedTheirAnchor = sampleAnchors[Math.floor(Math.random() * sampleAnchors.length)];
    setTheirAnchor(selectedTheirAnchor);

    if (generateHandshakeCallback) {
        const handshake = generateHandshakeCallback(anchor, selectedTheirAnchor);
        setMatchData(handshake);
    }

    setMatchingState('bridge');
  }, []);

  const reset = useCallback(() => {
    setMatchingState('none');
    setMyAnchor('');
    setTheirAnchor('');
    setMatchData(null);
  }, []);

  return {
    matchingState,
    myAnchor,
    theirAnchor,
    matchData,
    distance,
    signalBars,
    acceptMatch,
    reset
  };
};
