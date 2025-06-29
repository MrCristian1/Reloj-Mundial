import { useState, useEffect } from 'react';
import { WorldTime } from '../types/timezone';
import { timezoneService } from '../services/timezones';

export const useWorldTime = () => {
  const [worldTimes, setWorldTimes] = useState<WorldTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorldTimes = async () => {
    try {
      setLoading(true);
      setError(null);
      const times = await timezoneService.getWorldTimes();
      setWorldTimes(times);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch world times');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorldTimes();
    
    // Update every second for live clock
    const interval = setInterval(fetchWorldTimes, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { worldTimes, loading, error, refetch: fetchWorldTimes };
};