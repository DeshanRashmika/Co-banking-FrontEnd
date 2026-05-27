import { useMemo } from 'react';

// Returns period ('morning'|'afternoon'|'evening'|'night') for a given date and IANA timeZone.
// Accepts either a Date, timestamp, or ISO string via `date` and an IANA `timeZone` string.
export default function usePeriod({ date = new Date(), timeZone } = {}) {
  return useMemo(() => {
    const dt = date instanceof Date ? date : new Date(date);
    const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: tz });
    const parts = fmt.formatToParts(dt);
    const hourPart = parts.find((p) => p.type === 'hour');
    const hour = hourPart ? parseInt(hourPart.value, 10) : dt.getUTCHours();

    if (hour >= 5 && hour < 12) return { period: 'morning', hour };
    if (hour >= 12 && hour < 17) return { period: 'afternoon', hour };
    if (hour >= 17 && hour < 21) return { period: 'evening', hour };
    return { period: 'night', hour };
  }, [date, timeZone]);
}
