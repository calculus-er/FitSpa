import { saveWorkout, WorkoutData } from '@/lib/firebase/firestore';
import { Exercise } from './exerciseConfig';

export interface WorkoutSession {
  exercise: Exercise;
  startTime: Date;
  endTime?: Date;
  reps: number;
  formScores: number[];
  feedback: Array<{
    message: string;
    severity: 'good' | 'warning' | 'error';
    timestamp: Date;
  }>;
}

export class WorkoutRecorder {
  private session: WorkoutSession | null = null;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  startSession(exercise: Exercise): void {
    this.session = {
      exercise,
      startTime: new Date(),
      reps: 0,
      formScores: [],
      feedback: [],
    };
  }

  addFormScore(score: number): void {
    if (this.session) {
      this.session.formScores.push(score);
    }
  }

  addFeedback(message: string, severity: 'good' | 'warning' | 'error'): void {
    if (this.session) {
      this.session.feedback.push({
        message,
        severity,
        timestamp: new Date(),
      });
    }
  }

  updateReps(reps: number): void {
    if (this.session) {
      this.session.reps = reps;
    }
  }

  async endSession(): Promise<string | null> {
    if (!this.session) {
      return null;
    }

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - this.session.startTime.getTime()) / 1000);
    
    // Calculate average form score
    const avgFormScore = this.session.formScores.length > 0
      ? Math.round(this.session.formScores.reduce((a, b) => a + b, 0) / this.session.formScores.length)
      : 100;

    const workoutData: Omit<WorkoutData, 'createdAt'> = {
      userId: this.userId,
      exerciseId: this.session.exercise.id,
      exerciseName: this.session.exercise.name,
      startTime: this.session.startTime,
      endTime,
      duration,
      reps: this.session.reps,
      formScore: avgFormScore,
      feedback: this.session.feedback,
    };

    try {
      const workoutId = await saveWorkout(workoutData);
      this.session = null;
      return workoutId;
    } catch (error) {
      console.error('Error saving workout session:', error);
      // Don't throw error if Firebase is not configured - just log it
      if (this.userId === 'demo-user') {
        console.warn('Workout data not saved - Firebase not configured. This is normal for local testing.');
        this.session = null;
        return 'demo-workout-id';
      }
      throw error;
    }
  }

  getSession(): WorkoutSession | null {
    return this.session;
  }
}

