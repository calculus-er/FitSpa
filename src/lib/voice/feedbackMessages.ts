import { FormFeedback } from '@/lib/exercises/formValidator';

export const getFeedbackMessage = (feedback: FormFeedback, exerciseName: string): string => {
  if (feedback.severity === 'good') {
    return feedback.message || 'Good form!';
  } else if (feedback.severity === 'warning') {
    return feedback.message || 'Adjust your form';
  } else {
    return feedback.message || 'Correct your form';
  }
};

export const getRepCountMessage = (repCount: number, target: number): string => {
  if (repCount === 0) {
    return 'Let\'s go! Start your first rep';
  } else if (repCount === target) {
    return `Amazing! You completed ${target} reps!`;
  } else if (repCount === Math.floor(target / 2)) {
    return `Halfway there! ${repCount} reps done`;
  } else if (repCount === target - 1) {
    return 'One more rep! You\'ve got this!';
  } else if (repCount % 5 === 0) {
    return `${repCount} reps completed! Keep going!`;
  }
  return '';
};

export const getFormScoreMessage = (score: number): string => {
  if (score >= 90) {
    return 'Excellent form!';
  } else if (score >= 70) {
    return 'Good form, keep it up!';
  } else if (score >= 50) {
    return 'Focus on your form';
  } else {
    return 'Adjust your posture';
  }
};

