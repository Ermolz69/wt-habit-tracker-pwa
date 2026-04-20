import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useNetworkStatus } from './useNetworkStatus';

const setOnlineStatus = (value: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    value,
  });
};

describe('useNetworkStatus', () => {
  it('tracks browser online and offline events', () => {
    setOnlineStatus(true);

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current).toBe(true);

    act(() => {
      setOnlineStatus(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);

    act(() => {
      setOnlineStatus(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(true);
  });
});
