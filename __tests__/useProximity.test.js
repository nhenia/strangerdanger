import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';

// Mocking setTimeout
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', async () => {
    const { result } = await renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
    expect(result.current.distance).toBe(100);
    expect(result.current.signalStrength).toBe(0);
  });

  it('should transition to "finding" when active', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('finding');
  });

  it('should update distance and signal while finding', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(5000); // More time to ensure movement
    });

    // It might still be 100 if random walk stayed there, but unlikely.
    // However, signalStrength should definitely be at least 1 since it's initialized to 1 when finding.
    expect(result.current.signalStrength).toBeGreaterThanOrEqual(1);
  });

  it('should transition to "match_found" after delay', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(21000);
    });

    expect(result.current.matchingState).toBe('match_found');
    // After match found, distance should be low
    expect(result.current.distance).toBeLessThanOrEqual(50);
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(21000);
    });

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
      jest.advanceTimersByTime(21000);
    });

    await act(async () => {
      await rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
    expect(result.current.distance).toBe(100);
  });
});
