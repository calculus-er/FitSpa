import { PoseLandmarks, POSE_LANDMARKS } from '@/lib/pose-detection/poseDetector';

// Re-export POSE_LANDMARKS for convenience
export { POSE_LANDMARKS };

export interface FormFeedback {
  isValid: boolean;
  message: string;
  severity: 'good' | 'warning' | 'error';
}

export interface ExerciseFormValidator {
  validateForm(landmarks: PoseLandmarks[]): FormFeedback;
  detectRepPhase(landmarks: PoseLandmarks[], previousLandmarks?: PoseLandmarks[]): 'up' | 'down' | 'hold' | null;
  calculateFormScore(landmarks: PoseLandmarks[]): number; // 0-100
}

// Helper function to get landmark safely
export const getLandmark = (
  landmarks: PoseLandmarks[],
  index: number
): PoseLandmarks | null => {
  if (index >= 0 && index < landmarks.length && landmarks[index]) {
    return landmarks[index];
  }
  return null;
};

// Calculate distance between two landmarks
export const calculateDistance = (
  landmark1: PoseLandmarks,
  landmark2: PoseLandmarks
): number => {
  const dx = landmark1.x - landmark2.x;
  const dy = landmark1.y - landmark2.y;
  const dz = landmark1.z - landmark2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Calculate angle between three landmarks (point2 is the vertex)
export const calculateAngle = (
  point1: PoseLandmarks,
  point2: PoseLandmarks,
  point3: PoseLandmarks
): number => {
  const a = calculateDistance(point1, point2);
  const b = calculateDistance(point2, point3);
  const c = calculateDistance(point1, point3);

  if (a === 0 || b === 0) return 0;

  // Use law of cosines
  const angle = Math.acos(Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b))));
  return (angle * 180) / Math.PI; // Convert to degrees
};

// Check if landmark is visible
export const isVisible = (landmark: PoseLandmarks | null, threshold = 0.5): boolean => {
  return landmark !== null && (landmark.visibility ?? 1) > threshold;
};

