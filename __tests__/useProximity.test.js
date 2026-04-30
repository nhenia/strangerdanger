import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';

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

    await act(async () => {
      jest.advanceTimersByTime(3001);
    });
    expect(result.current.matchingState).toBe('scanning');

    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    expect(result.current.matchingState).toBe('matching');

    await act(async () => {
      jest.advanceTimersByTime(4001);
    });
    expect(result.current.matchingState).toBe('pinpointing');

    await act(async () => {
      jest.advanceTimersByTime(5001);
    });
    expect(result.current.matchingState).toBe('match_found');
    expect(result.current.distance).toBe(0);
    expect(result.current.signalBars).toBe(5);
  });

  it('should change distance over time while finding', async () => {
    const { result } = await renderHook(() => useProximity(true));

    expect(result.current.distance).toBe(100);

    // Advance to scanning
    await act(async () => {
      jest.advanceTimersByTime(3001);
    });
    expect(result.current.matchingState).toBe('scanning');

    // Interval is 1500ms
    await act(async () => {
      jest.advanceTimersByTime(1501);
    });

    // In scanning, target is 50. Distance should decrease from 100.
    expect(result.current.distance).toBeLessThan(100);
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    // Fast forward to match_found
    await act(async () => {
      jest.advanceTimersByTime(3001); // -> scanning
    });
    await act(async () => {
      jest.advanceTimersByTime(4001); // -> matching
    });
    await act(async () => {
      jest.advanceTimersByTime(4001); // -> pinpointing
    });
    await act(async () => {
      jest.advanceTimersByTime(5001); // -> match_found
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
      jest.advanceTimersByTime(3001); // -> scanning
    });
    await act(async () => {
      jest.advanceTimersByTime(4001); // -> matching
    });
    await act(async () => {
      jest.advanceTimersByTime(4001); // -> pinpointing
    });
    await act(async () => {
      jest.advanceTimersByTime(5001); // -> match_found
    });
    expect(result.current.matchingState).toBe('match_found');

    await act(async () => {
      rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
  });
});
