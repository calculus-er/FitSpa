import {
  ExerciseFormValidator,
  FormFeedback,
  getLandmark,
  calculateAngle,
  isVisible,
  POSE_LANDMARKS,
} from './formValidator';
import { PoseLandmarks } from '@/lib/pose-detection/poseDetector';

export class SquatValidator implements ExerciseFormValidator {
  private previousPhase: 'up' | 'down' | null = null;
  private previousHipY: number | null = null;

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

    // Check knee alignment (knees should track over toes)
    if (leftKnee && rightKnee && leftAnkle && rightAnkle) {
      const leftKneeAnkleX = Math.abs(leftKnee.x - leftAnkle.x);
      const rightKneeAnkleX = Math.abs(rightKnee.x - rightAnkle.x);

      if (leftKneeAnkleX > 0.1 || rightKneeAnkleX > 0.1) {
        return {
          isValid: false,
          message: 'Keep your knees aligned over your toes',
          severity: 'error',
        };
      }
    }

    // Check knee angle (should be around 90 degrees at bottom)
    if (leftHip && leftKnee && leftAnkle) {
      const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

      if (kneeAngle < 60) {
        return {
          isValid: false,
          message: 'Don\'t go too low - aim for 90 degrees',
          severity: 'warning',
        };
      }

      if (kneeAngle > 120) {
        return {
          isValid: false,
          message: 'Lower your body more - aim for 90 degrees at the bottom',
          severity: 'warning',
        };
      }
    }

    // Check back alignment (shoulders should be over hips)
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderX = (leftShoulder.x + rightShoulder.x) / 2;
      const hipX = (leftHip.x + rightHip.x) / 2;
      const alignmentDiff = Math.abs(shoulderX - hipX);

      if (alignmentDiff > 0.05) {
        return {
          isValid: false,
          message: 'Keep your back straight - shoulders over hips',
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
    const currentHipY = leftHip.y;

    // Determine phase based on knee angle and hip position
    if (kneeAngle < 90) {
      // At bottom of squat
      if (this.previousPhase !== 'down') {
        this.previousPhase = 'down';
        return 'down';
      }
      return 'hold';
    } else if (kneeAngle > 150) {
      // At top of squat
      if (this.previousPhase !== 'up') {
        this.previousPhase = 'up';
        return 'up';
      }
      return 'hold';
    }

    // Check if moving up or down based on hip position
    if (this.previousHipY !== null) {
      const hipMovement = currentHipY - this.previousHipY;
      if (Math.abs(hipMovement) > 0.01) {
        if (hipMovement > 0) {
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

    this.previousHipY = currentHipY;
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

    // Check knee alignment
    if (leftKnee && leftAnkle && rightKnee && rightAnkle) {
      const leftKneeAnkleX = Math.abs(leftKnee.x - leftAnkle.x);
      const rightKneeAnkleX = Math.abs(rightKnee.x - rightAnkle.x);
      score -= Math.min(30, (leftKneeAnkleX + rightKneeAnkleX) * 300);
    }

    // Check knee angle (ideal is 90 at bottom)
    if (leftHip && leftKnee && leftAnkle) {
      const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const angleDeviation = Math.abs(kneeAngle - 90);
      score -= Math.min(20, angleDeviation * 0.2);
    }

    // Check back alignment
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderX = (leftShoulder.x + rightShoulder.x) / 2;
      const hipX = (leftHip.x + rightHip.x) / 2;
      const alignmentDiff = Math.abs(shoulderX - hipX);
      score -= Math.min(20, alignmentDiff * 400);
    }

    // Check symmetry
    if (leftHip && leftKnee && leftAnkle && rightHip && rightKnee && rightAnkle) {
      const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const angleDiff = Math.abs(leftKneeAngle - rightKneeAngle);
      score -= Math.min(20, angleDiff * 2);
    }

    return Math.max(0, Math.min(100, score));
  }
}

