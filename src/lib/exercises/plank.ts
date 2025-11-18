import {
  ExerciseFormValidator,
  FormFeedback,
  getLandmark,
  calculateAngle,
  isVisible,
  POSE_LANDMARKS,
} from './formValidator';
import { PoseLandmarks } from '@/lib/pose-detection/poseDetector';

export class PlankValidator implements ExerciseFormValidator {
  validateForm(landmarks: PoseLandmarks[]): FormFeedback {
    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const rightShoulder = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER);
    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);
    const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
    const rightKnee = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_KNEE);
    const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
    const rightAnkle = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ANKLE);

    // Check visibility
    if (
      !isVisible(leftShoulder) ||
      !isVisible(rightShoulder) ||
      !isVisible(leftHip) ||
      !isVisible(rightHip)
    ) {
      return {
        isValid: false,
        message: 'Please ensure your body is visible',
        severity: 'warning',
      };
    }

    // Check if body is straight (plank position)
    if (leftShoulder && rightShoulder && leftHip && rightHip && leftAnkle && rightAnkle) {
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const ankleY = (leftAnkle.y + rightAnkle.y) / 2;

      // Shoulders, hips, and ankles should be roughly aligned
      const maxY = Math.max(shoulderY, hipY, ankleY);
      const minY = Math.min(shoulderY, hipY, ankleY);
      const verticalDiff = maxY - minY;

      if (verticalDiff > 0.1) {
        return {
          isValid: false,
          message: 'Keep your body straight - align shoulders, hips, and ankles',
          severity: 'error',
        };
      }

      // Check if hips are too high (common mistake)
      if (hipY < shoulderY - 0.05) {
        return {
          isValid: false,
          message: 'Lower your hips - keep your body straight',
          severity: 'error',
        };
      }

      // Check if hips are too low (sagging)
      if (hipY > shoulderY + 0.08) {
        return {
          isValid: false,
          message: 'Lift your hips - keep your body straight',
          severity: 'error',
        };
      }
    }

    // Check if knees are bent (should be straight for plank)
    if (leftHip && leftKnee && leftAnkle) {
      const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      if (kneeAngle < 160) {
        return {
          isValid: false,
          message: 'Straighten your legs - keep knees locked',
          severity: 'warning',
        };
      }
    }

    return {
      isValid: true,
      message: 'Good form! Keep your core engaged',
      severity: 'good',
    };
  }

  detectRepPhase(
    landmarks: PoseLandmarks[],
    previousLandmarks?: PoseLandmarks[]
  ): 'up' | 'down' | 'hold' | null {
    // Plank is a static hold, so we don't detect rep phases
    // Instead, we track if the form is being maintained
    return 'hold';
  }

  calculateFormScore(landmarks: PoseLandmarks[]): number {
    let score = 100;

    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const rightShoulder = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER);
    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);
    const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
    const rightAnkle = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ANKLE);
    const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
    const rightKnee = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_KNEE);

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
      return 0;
    }

    // Check body alignment
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;
    const ankleY = (leftAnkle.y + rightAnkle.y) / 2;

    const maxY = Math.max(shoulderY, hipY, ankleY);
    const minY = Math.min(shoulderY, hipY, ankleY);
    const verticalDiff = maxY - minY;

    score -= Math.min(40, verticalDiff * 400); // Deduct up to 40 points for misalignment

    // Check knee straightness
    if (leftHip && leftKnee && leftAnkle) {
      const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const angleDeviation = Math.abs(kneeAngle - 180);
      score -= Math.min(20, angleDeviation * 0.2);
    }

    // Check symmetry
    if (leftHip && rightHip) {
      const hipHeightDiff = Math.abs(leftHip.y - rightHip.y);
      score -= Math.min(20, hipHeightDiff * 400);
    }

    return Math.max(0, Math.min(100, score));
  }
}

