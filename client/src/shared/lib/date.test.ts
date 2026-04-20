import { describe, expect, it, vi } from 'vitest';
import { getFormattedDate, getLastNDays } from './date';

describe('date helpers', () => {
  it('formats dates as YYYY-MM-DD', () => {
    expect(getFormattedDate(new Date('2026-04-05T12:00:00.000Z'))).toBe('2026-04-05');
  });

  it('returns last N days including today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-20T12:00:00.000Z'));

    expect(getLastNDays(3)).toEqual(['2026-04-18', '2026-04-19', '2026-04-20']);

    vi.useRealTimers();
  });
});
