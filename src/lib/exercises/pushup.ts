import {
  ExerciseFormValidator,
  FormFeedback,
  getLandmark,
  calculateAngle,
  isVisible,
  POSE_LANDMARKS,
} from './formValidator';
import { PoseLandmarks } from '@/lib/pose-detection/poseDetector';

export class PushupValidator implements ExerciseFormValidator {
  private previousPhase: 'up' | 'down' | null = null;
  private previousShoulderY: number | null = null;

  validateForm(landmarks: PoseLandmarks[]): FormFeedback {
    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const rightShoulder = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER);
    const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
    const rightElbow = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ELBOW);
    const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);
    const rightWrist = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_WRIST);
    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);

    // Check visibility
    if (
      !isVisible(leftShoulder) ||
      !isVisible(rightShoulder) ||
      !isVisible(leftElbow) ||
      !isVisible(rightElbow) ||
      !isVisible(leftWrist) ||
      !isVisible(rightWrist)
    ) {
      return {
        isValid: false,
        message: 'Please ensure your upper body is visible',
        severity: 'warning',
      };
    }

    // Check if body is horizontal (push-up position)
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const verticalDiff = Math.abs(shoulderY - hipY);

      if (verticalDiff > 0.15) {
        return {
          isValid: false,
          message: 'Keep your body straight - align shoulders with hips',
          severity: 'error',
        };
      }
    }

    // Check elbow angle (should be around 90 degrees at bottom, 180 at top)
    if (leftShoulder && leftElbow && leftWrist) {
      const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      
      if (elbowAngle < 70) {
        return {
          isValid: false,
          message: 'Lower your body more - aim for 90 degrees at the bottom',
          severity: 'warning',
        };
      }

      if (elbowAngle > 160) {
        return {
          isValid: true,
          message: 'Good form! Keep your core engaged',
          severity: 'good',
        };
      }
    }

    // Check wrist alignment
    if (leftWrist && rightWrist && leftShoulder && rightShoulder) {
      const wristY = (leftWrist.y + rightWrist.y) / 2;
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;

      if (wristY > shoulderY + 0.1) {
        return {
          isValid: false,
          message: 'Keep your hands below your shoulders',
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
    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
    const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

    if (!leftShoulder || !leftElbow || !leftWrist) {
      return null;
    }

    if (!isVisible(leftShoulder) || !isVisible(leftElbow) || !isVisible(leftWrist)) {
      return null;
    }

    const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const currentShoulderY = leftShoulder.y;

    // Determine phase based on elbow angle and shoulder position
    if (elbowAngle < 90) {
      // At bottom of push-up
      if (this.previousPhase !== 'down') {
        this.previousPhase = 'down';
        return 'down';
      }
      return 'hold';
    } else if (elbowAngle > 160) {
      // At top of push-up
      if (this.previousPhase !== 'up') {
        this.previousPhase = 'up';
        return 'up';
      }
      return 'hold';
    }

    // Check if moving up or down based on shoulder position
    if (this.previousShoulderY !== null) {
      const shoulderMovement = currentShoulderY - this.previousShoulderY;
      if (Math.abs(shoulderMovement) > 0.01) {
        if (shoulderMovement < 0) {
          // Moving up
          if (this.previousPhase !== 'up') {
            this.previousPhase = 'up';
            return 'up';
          }
        } else {
          // Moving down
          if (this.previousPhase !== 'down') {
            this.previousPhase = 'down';
            return 'down';
          }
        }
      }
    }

    this.previousShoulderY = currentShoulderY;
    return this.previousPhase || null;
  }

  calculateFormScore(landmarks: PoseLandmarks[]): number {
    let score = 100;

    const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
    const rightShoulder = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER);
    const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
    const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);
    const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
    const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);

    if (!leftShoulder || !rightShoulder || !leftElbow || !leftWrist || !leftHip || !rightHip) {
      return 0;
    }

    // Check body alignment (shoulders and hips should be aligned)
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;
    const alignmentDiff = Math.abs(shoulderY - hipY);
    score -= Math.min(30, alignmentDiff * 200); // Deduct up to 30 points

    // Check elbow angle (ideal is 90 at bottom, 180 at top)
    const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    if (elbowAngle < 70 || elbowAngle > 180) {
      score -= 20; // Deduct for poor range of motion
    }

    // Check symmetry
    const rightElbow = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ELBOW);
    const rightWrist = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_WRIST);
    if (rightElbow && rightWrist) {
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      const angleDiff = Math.abs(elbowAngle - rightElbowAngle);
      score -= Math.min(20, angleDiff * 2); // Deduct for asymmetry
    }

    return Math.max(0, Math.min(100, score));
  }
}

