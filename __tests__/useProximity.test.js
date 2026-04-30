import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';
import * as Location from 'expo-location';

// Mocking expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: 0, longitude: 0, accuracy: 5 },
  })),
  watchPositionAsync: jest.fn((options, callback) => {
    return Promise.resolve({
      remove: jest.fn(),
    });
  }),
  Accuracy: { High: 4 },
}));

// Mocking setTimeout
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', async () => {
    const { result } = await renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
  });

  it('should transition to "broadcasting" when active', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('broadcasting');
  });

  it('should transition through states to "match_found" after delays', async () => {
    const { result } = await renderHook(() => useProximity(true));

    expect(result.current.matchingState).toBe('broadcasting');

    // To scanning
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });
    expect(result.current.matchingState).toBe('scanning');

    // To matching
    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    expect(result.current.matchingState).toBe('matching');

    // To pinpointing
    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    expect(result.current.matchingState).toBe('pinpointing');

    // To match_found
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });
    expect(result.current.matchingState).toBe('match_found');
    expect(result.current.distance).toBe(0);
    expect(result.current.signalBars).toBe(5);
  });

  it('should decrease distance over time while scanning/matching', async () => {
    const { result } = await renderHook(() => useProximity(true));

    expect(result.current.distance).toBe(100);

    // Advance to scanning
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });

    // Distance should decrease over time
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.distance).toBeLessThan(100);
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    // Fast forward to match_found
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });
    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });

    expect(result.current.matchingState).toBe('match_found');

    await act(async () => {
      result.current.acceptMatch('My Anchor', (a, b) => ({ call: a, response: b }));
    });

    expect(result.current.matchingState).toBe('bridge');
    expect(result.current.myAnchor).toBe('My Anchor');
    expect(result.current.theirAnchor).toBeTruthy();
    expect(result.current.matchData.call).toBe('My Anchor');
  });

  it('should reset when deactivated', async () => {
    const { result, rerender } = await renderHook(({ active }) => useProximity(active), {
      initialProps: { active: true }
    });

    await act(async () => {
      jest.advanceTimersByTime(3001);
    });
    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });

    expect(result.current.matchingState).toBe('match_found');

    await act(async () => {
      await rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
  });
});
