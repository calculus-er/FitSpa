import { useState, useEffect } from 'react';
import { getAnalytics, AnalyticsData } from '@/lib/firebase/firestore';

export const useAnalytics = (userId: string | null) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics(userId);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  return { analytics, loading, error };
};

