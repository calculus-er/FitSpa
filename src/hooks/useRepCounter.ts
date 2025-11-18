import { useState, useEffect, useRef } from 'react';
import { PoseLandmarks } from '@/lib/pose-detection/poseDetector';
import { Exercise } from '@/lib/workout/exerciseConfig';

interface UseRepCounterOptions {
  exercise: Exercise;
  landmarks: PoseLandmarks[] | null;
  isActive: boolean;
}

export const useRepCounter = ({ exercise, landmarks, isActive }: UseRepCounterOptions) => {
  const [repCount, setRepCount] = useState(0);
  const [previousPhase, setPreviousPhase] = useState<'up' | 'down' | 'hold' | null>(null);
  const previousLandmarksRef = useRef<PoseLandmarks[] | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Handle time-based exercises (plank)
  useEffect(() => {
    if (exercise.id === 'plank') {
      if (isActive && !timeIntervalRef.current) {
        startTimeRef.current = new Date();
        timeIntervalRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
            setRepCount(elapsed);
          }
        }, 1000);
      } else if (!isActive && timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    };
  }, [isActive, exercise.id]);

  // Handle rep-based exercises
  useEffect(() => {
    if (exercise.id === 'plank' || !isActive || !landmarks || landmarks.length === 0) {
      return;
    }

    const phase = exercise.validator.detectRepPhase(landmarks, previousLandmarksRef.current || undefined);

    // Detect rep completion: down -> up transition
    if (phase === 'up' && previousPhase === 'down') {
      setRepCount((prev) => prev + 1);
    }

    setPreviousPhase(phase);
    previousLandmarksRef.current = landmarks;
  }, [landmarks, isActive, exercise, previousPhase]);

  const reset = () => {
    setRepCount(0);
    setPreviousPhase(null);
    previousLandmarksRef.current = null;
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
    startTimeRef.current = null;
  };

  return {
    repCount,
    reset,
    currentPhase: previousPhase,
  };
};

