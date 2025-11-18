import {
  ExerciseFormValidator,
  FormFeedback,
  getLandmark,
  calculateAngle,
  isVisible,
  POSE_LANDMARKS,
} from './formValidator';
import { PoseLandmarks } from '@/lib/pose-detection/poseDetector';

export class LungeValidator implements ExerciseFormValidator {
  private previousPhase: 'up' | 'down' | null = null;
  private previousKneeY: number | null = null;

  validateForm(landmarks: PoseLandmarks[]): FormFeedback {
    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);
    const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
    const rightKnee = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_KNEE);
    const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
    const rightAnkle = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ANKLE);
    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const rightShoulder = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER);

    // Check visibility
    if (
      !isVisible(leftHip) ||
      !isVisible(rightHip) ||
      !isVisible(leftKnee) ||
      !isVisible(rightKnee) ||
      !isVisible(leftAnkle) ||
      !isVisible(rightAnkle)
    ) {
      return {
        isValid: false,
        message: 'Please ensure your lower body is visible',
        severity: 'warning',
      };
    }

    // Check front knee alignment (should be over ankle, not past it)
    if (leftKnee && leftAnkle) {
      const kneeAnkleX = leftKnee.x - leftAnkle.x;
      if (kneeAnkleX > 0.05) {
        return {
          isValid: false,
          message: 'Keep your front knee behind your toes',
          severity: 'error',
        };
      }
    }

    // Check front knee angle (should be around 90 degrees at bottom)
    if (leftHip && leftKnee && leftAnkle) {
      const frontKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

      if (frontKneeAngle < 70) {
        return {
          isValid: false,
          message: 'Don\'t go too low - aim for 90 degrees',
          severity: 'warning',
        };
      }

      if (frontKneeAngle > 110) {
        return {
          isValid: false,
          message: 'Lower your body more - aim for 90 degrees at the bottom',
          severity: 'warning',
        };
      }
    }

    // Check back leg (should be straight)
    if (rightHip && rightKnee && rightAnkle) {
      const backKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      if (backKneeAngle < 150) {
        return {
          isValid: false,
          message: 'Straighten your back leg',
          severity: 'warning',
        };
      }
    }

    // Check torso alignment (should be upright)
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const verticalDiff = Math.abs(shoulderY - hipY);

      if (verticalDiff < 0.05) {
        return {
          isValid: false,
          message: 'Keep your torso upright - don\'t lean forward',
          severity: 'warning',
        };
      }
    }

    return {
      isValid: true,
      message: 'Good form!',
      severity: 'good',
    };
  }

  detectRepPhase(
    landmarks: PoseLandmarks[],
    previousLandmarks?: PoseLandmarks[]
  ): 'up' | 'down' | 'hold' | null {
    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
    const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);

    if (!leftHip || !leftKnee || !leftAnkle) {
      return null;
    }

    if (!isVisible(leftHip) || !isVisible(leftKnee) || !isVisible(leftAnkle)) {
      return null;
    }

    const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const currentKneeY = leftKnee.y;

    // Determine phase based on knee angle and position
    if (kneeAngle < 90) {
      // At bottom of lunge
      if (this.previousPhase !== 'down') {
        this.previousPhase = 'down';
        return 'down';
      }
      return 'hold';
    } else if (kneeAngle > 150) {
      // At top of lunge
      if (this.previousPhase !== 'up') {
        this.previousPhase = 'up';
        return 'up';
      }
      return 'hold';
    }

    // Check if moving up or down based on knee position
    if (this.previousKneeY !== null) {
      const kneeMovement = currentKneeY - this.previousKneeY;
      if (Math.abs(kneeMovement) > 0.01) {
        if (kneeMovement > 0) {
          // Moving down
          if (this.previousPhase !== 'down') {
            this.previousPhase = 'down';
            return 'down';
          }
        } else {
          // Moving up
          if (this.previousPhase !== 'up') {
            this.previousPhase = 'up';
            return 'up';
          }
        }
      }
    }

    this.previousKneeY = currentKneeY;
    return this.previousPhase || null;
  }

  calculateFormScore(landmarks: PoseLandmarks[]): number {
    let score = 100;

    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);
    const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
    const rightKnee = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_KNEE);
    const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
    const rightAnkle = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ANKLE);
    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const rightShoulder = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER);

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return 0;
    }

    // Check front knee alignment
    if (leftKnee && leftAnkle) {
      const kneeAnkleX = Math.abs(leftKnee.x - leftAnkle.x);
      score -= Math.min(30, kneeAnkleX * 600);
    }

    // Check front knee angle (ideal is 90 at bottom)
    if (leftHip && leftKnee && leftAnkle) {
      const frontKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const angleDeviation = Math.abs(frontKneeAngle - 90);
      score -= Math.min(20, angleDeviation * 0.2);
    }

    // Check back leg straightness
    if (rightHip && rightKnee && rightAnkle) {
      const backKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const angleDeviation = Math.abs(backKneeAngle - 180);
      score -= Math.min(20, angleDeviation * 0.2);
    }

    // Check torso alignment
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const verticalDiff = Math.abs(shoulderY - hipY);
      if (verticalDiff < 0.05) {
        score -= 20; // Deduct for leaning forward
      }
    }

    return Math.max(0, Math.min(100, score));
  }
}

