import { renderHook, act } from '@testing-library/react-native';
import { useProximity } from '../src/hooks/useProximity';

// Mocking setTimeout
jest.useFakeTimers();

describe('useProximity', () => {
  it('should start in "none" state', async () => {
    const { result } = await renderHook(() => useProximity(false));
    expect(result.current.matchingState).toBe('none');
  });

  it('should transition to "searching" when active', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('searching');
  });

  it('should transition through states to "match_found" after delay', async () => {
    const { result } = await renderHook(() => useProximity(true));
    expect(result.current.matchingState).toBe('searching');

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.matchingState).toBe('detecting');

    await act(async () => {
      jest.advanceTimersByTime(6000);
    });
    expect(result.current.matchingState).toBe('approaching');

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.matchingState).toBe('match_found');
  });

  it('should transition to "bridge" when match is accepted', async () => {
    const { result } = await renderHook(() => useProximity(true));

    await act(async () => {
      jest.advanceTimersByTime(20000); // Pass all states
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
      jest.advanceTimersByTime(11000);
    });

    await act(async () => {
      await rerender({ active: false });
    });

    expect(result.current.matchingState).toBe('none');
    expect(result.current.myAnchor).toBe('');
  });
});
