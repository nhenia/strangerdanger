import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';

/**
 * Hook to simulate proximity detection and matching logic.
 * Incorporates real Geolocation data if available to influence proximity simulation.
 *
 * States: none -> broadcasting -> scanning -> matching -> pinpointing -> match_found -> bridge
 */
export const useProximity = (isActive) => {
  const [matchingState, setMatchingState] = useState('none');
  const [myAnchor, setMyAnchor] = useState('');
  const [theirAnchor, setTheirAnchor] = useState('');
  const [matchData, setMatchData] = useState(null);
  const [distance, setDistance] = useState(100);
  const [signalBars, setSignalBars] = useState(1);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const initialLocation = useRef(null);
  const locationSubscription = useRef(null);

  // Handle location tracking separately
  useEffect(() => {
    let isMounted = true;

    const startTracking = async () => {
      if (!isActive) return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (isMounted) setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      if (isMounted) {
        setLocation(loc);
        initialLocation.current = loc;
      }

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (newLocation) => {
          if (isMounted) setLocation(newLocation);
        }
      );

      if (isMounted) {
        locationSubscription.current = sub;
      } else {
        sub.remove();
      }
    };

    if (isActive) {
      startTracking();
    } else {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
      setLocation(null);
      initialLocation.current = null;
    }

    return () => {
      isMounted = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [isActive]);

  // Handle state machine
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
      } else if (matchingState === 'scanning') {
        timer = setTimeout(() => {
          setMatchingState('matching');
        }, 4000);
      } else if (matchingState === 'matching') {
        timer = setTimeout(() => {
          setMatchingState('pinpointing');
        }, 4000);
      } else if (matchingState === 'pinpointing') {
        timer = setTimeout(() => {
          setMatchingState('match_found');
        }, 3000);
      } else if (matchingState === 'match_found') {
        setDistance(0);
        setSignalBars(5);
      }

      // Simulation interval for distance and signal bars
      if (['scanning', 'matching', 'pinpointing'].includes(matchingState)) {
        interval = setInterval(() => {
          setSignalBars(prev => {
            if (matchingState === 'pinpointing') return 4 + Math.floor(Math.random() * 2);
            const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            return Math.max(1, Math.min(5, prev + delta));
          });

          setDistance(prev => {
            if (matchingState === 'pinpointing') return Math.max(1, Math.min(5, prev - 1));

            let drift = 0;
            if (location && initialLocation.current) {
                // Calculate distance from initial point to current point (very rough estimation)
                const lat1 = initialLocation.current.coords.latitude;
                const lon1 = initialLocation.current.coords.longitude;
                const lat2 = location.coords.latitude;
                const lon2 = location.coords.longitude;

                // Rough meter conversion for small distances
                const dLat = (lat2 - lat1) * 111320;
                const dLon = (lon2 - lon1) * 111320 * Math.cos(lat1 * Math.PI / 180);
                const moved = Math.sqrt(dLat * dLat + dLon * dLon);

                // If moved away from initial point, maybe it takes longer/distance increases?
                // For simulation, let's just use it to add some "jitter"
                drift = moved > 5 ? 2 : 0;
            }

            const decrease = Math.floor(Math.random() * 5) + 2 - drift;
            return Math.max(5, prev - decrease);
          });
        }, 1500);
      }
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
  }, [isActive, matchingState, location]);

  const acceptMatch = useCallback((anchor, generateHandshakeCallback) => {
    setMyAnchor(anchor);

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
    setDistance(100);
    setSignalBars(1);
  }, []);

  return {
    matchingState,
    myAnchor,
    theirAnchor,
    matchData,
    distance,
    signalBars,
    location,
    errorMsg,
    acceptMatch,
    reset
  };
};
