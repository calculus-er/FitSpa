import { useState, useEffect } from 'react';
import { PoseLandmarks } from '@/lib/pose-detection/poseDetector';
import { Exercise } from '@/lib/workout/exerciseConfig';
import { FormFeedback } from '@/lib/exercises/formValidator';

interface UseFormAnalysisOptions {
  exercise: Exercise;
  landmarks: PoseLandmarks[] | null;
  isActive: boolean;
}

export const useFormAnalysis = ({ exercise, landmarks, isActive }: UseFormAnalysisOptions) => {
  const [feedback, setFeedback] = useState<FormFeedback>({
    isValid: true,
    message: 'Ready to start',
    severity: 'good',
  });
  const [formScore, setFormScore] = useState(100);

  useEffect(() => {
    if (!isActive || !landmarks || landmarks.length === 0) {
      setFeedback({
        isValid: true,
        message: 'Ready to start',
        severity: 'good',
      });
      setFormScore(100);
      return;
    }

    const validation = exercise.validator.validateForm(landmarks);
    const score = exercise.validator.calculateFormScore(landmarks);

    setFeedback(validation);
    setFormScore(score);
  }, [landmarks, isActive, exercise]);

  return {
    feedback,
    formScore,
  };
};

