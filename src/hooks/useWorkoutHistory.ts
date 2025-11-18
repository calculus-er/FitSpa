import { useState, useEffect } from 'react';
import { getUserWorkouts, WorkoutData } from '@/lib/firebase/firestore';

export const useWorkoutHistory = (userId: string | null, limitCount = 50) => {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const data = await getUserWorkouts(userId, limitCount);
        setWorkouts(data as WorkoutData[]);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching workouts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [userId, limitCount]);

  return { workouts, loading, error };
};

