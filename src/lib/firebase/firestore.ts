import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface WorkoutData {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  reps: number;
  formScore: number; // 0-100
  feedback: Array<{
    message: string;
    severity: 'good' | 'warning' | 'error';
    timestamp: Date;
  }>;
  createdAt: Date;
}

export interface AnalyticsData {
  totalWorkouts: number;
  totalReps: number;
  totalMinutes: number;
  currentStreak: number;
  lastWorkoutDate: Date | null;
  weeklyStats: Array<{
    date: string;
    reps: number;
    duration: number;
  }>;
  exerciseStats: Record<string, {
    completed: number;
    target: number;
  }>;
}

// Save workout to Firestore
export const saveWorkout = async (workoutData: Omit<WorkoutData, 'createdAt'>): Promise<string> => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please configure Firebase.');
  }
  
  try {
    const workoutRef = await addDoc(collection(db, 'workouts'), {
      ...workoutData,
      startTime: Timestamp.fromDate(workoutData.startTime),
      endTime: workoutData.endTime ? Timestamp.fromDate(workoutData.endTime) : null,
      createdAt: serverTimestamp(),
    });
    
    // Update analytics
    await updateAnalytics(workoutData.userId, workoutData);
    
    return workoutRef.id;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
};

// Get user workouts
export const getUserWorkouts = async (userId: string, limitCount = 50) => {
  if (!db) {
    console.warn('Firestore is not initialized. Returning empty array.');
    return [];
  }
  
  try {
    const workoutsRef = collection(db, 'workouts');
    const q = query(
      workoutsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

// Get analytics data
export const getAnalytics = async (userId: string): Promise<AnalyticsData> => {
  if (!db) {
    // Return default analytics if Firestore is not initialized
    return {
      totalWorkouts: 0,
      totalReps: 0,
      totalMinutes: 0,
      currentStreak: 0,
      lastWorkoutDate: null,
      weeklyStats: [],
      exerciseStats: {},
    };
  }
  
  try {
    const analyticsRef = doc(db, 'analytics', userId);
    const analyticsSnap = await getDoc(analyticsRef);
    
    if (analyticsSnap.exists()) {
      const data = analyticsSnap.data();
      return {
        ...data,
        lastWorkoutDate: data.lastWorkoutDate?.toDate() || null,
      } as AnalyticsData;
    }
    
    // Return default analytics if none exist
    return {
      totalWorkouts: 0,
      totalReps: 0,
      totalMinutes: 0,
      currentStreak: 0,
      lastWorkoutDate: null,
      weeklyStats: [],
      exerciseStats: {},
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// Update analytics
export const updateAnalytics = async (userId: string, workoutData: Omit<WorkoutData, 'createdAt'>) => {
  if (!db) {
    console.warn('Firestore is not initialized. Analytics not updated.');
    return;
  }
  
  try {
    const analyticsRef = doc(db, 'analytics', userId);
    const analyticsSnap = await getDoc(analyticsRef);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let currentStreak = 0;
    let lastWorkoutDate: Date | null = null;
    
    if (analyticsSnap.exists()) {
      const existingData = analyticsSnap.data();
      lastWorkoutDate = existingData.lastWorkoutDate?.toDate() || null;
      
      // Calculate streak
      if (lastWorkoutDate) {
        const lastDate = new Date(lastWorkoutDate);
        lastDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, maintain streak
          currentStreak = existingData.currentStreak || 0;
        } else if (daysDiff === 1) {
          // Consecutive day, increment streak
          currentStreak = (existingData.currentStreak || 0) + 1;
        } else {
          // Streak broken, reset to 1
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    // Get existing stats
    const existingData = analyticsSnap.exists() ? analyticsSnap.data() : {};
    const totalWorkouts = (existingData.totalWorkouts || 0) + 1;
    const totalReps = (existingData.totalReps || 0) + workoutData.reps;
    const totalMinutes = (existingData.totalMinutes || 0) + Math.round(workoutData.duration / 60);
    
    // Update weekly stats
    const weeklyStats = existingData.weeklyStats || [];
    const todayStr = today.toISOString().split('T')[0];
    const weekIndex = weeklyStats.findIndex((stat: any) => stat.date === todayStr);
    
    if (weekIndex >= 0) {
      weeklyStats[weekIndex].reps += workoutData.reps;
      weeklyStats[weekIndex].duration += Math.round(workoutData.duration / 60);
    } else {
      // Keep only last 7 days
      weeklyStats.push({
        date: todayStr,
        reps: workoutData.reps,
        duration: Math.round(workoutData.duration / 60),
      });
      
      // Sort by date and keep only last 7
      weeklyStats.sort((a: any, b: any) => a.date.localeCompare(b.date));
      if (weeklyStats.length > 7) {
        weeklyStats.shift();
      }
    }
    
    // Update exercise stats
    const exerciseStats = existingData.exerciseStats || {};
    if (!exerciseStats[workoutData.exerciseId]) {
      exerciseStats[workoutData.exerciseId] = { completed: 0, target: 0 };
    }
    exerciseStats[workoutData.exerciseId].completed += workoutData.reps;
    
    // Update analytics document
    await setDoc(analyticsRef, {
      totalWorkouts,
      totalReps,
      totalMinutes,
      currentStreak,
      lastWorkoutDate: Timestamp.fromDate(today),
      weeklyStats,
      exerciseStats,
    }, { merge: true });
  } catch (error) {
    console.error('Error updating analytics:', error);
    throw error;
  }
};

