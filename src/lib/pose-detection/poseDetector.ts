// @ts-ignore - MediaPipe types may not be available
import { Pose } from '@mediapipe/pose';
// @ts-ignore
import { Camera } from '@mediapipe/camera_utils';
// @ts-ignore
import { POSE_CONNECTIONS, drawConnections, drawLandmarks } from '@mediapipe/drawing_utils';

export interface PoseLandmarks {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResults {
  landmarks: PoseLandmarks[];
  image: HTMLCanvasElement;
}

export class PoseDetector {
  private pose: Pose;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private onResultsCallback: ((results: PoseResults) => void) | null = null;

  constructor() {
    this.pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.pose.onResults((results) => {
      if (this.onResultsCallback && results.poseLandmarks) {
        const landmarks = results.poseLandmarks.map((landmark) => ({
          x: landmark.x,
          y: landmark.y,
          z: landmark.z,
          visibility: landmark.visibility,
        }));

        // Draw pose on canvas
        if (this.canvasElement) {
          const ctx = this.canvasElement.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            ctx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
            
            // Draw pose connections and landmarks
            drawConnections(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 2,
            });
            drawLandmarks(ctx, results.poseLandmarks, {
              color: '#FF0000',
              lineWidth: 1,
              radius: 3,
            });
            ctx.restore();
          }
        }

        this.onResultsCallback({
          landmarks,
          image: results.image,
        });
      }
    });
  }

  public startDetection(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    onResults: (results: PoseResults) => void
  ): void {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.onResultsCallback = onResults;

    // Set canvas dimensions to match video
    if (videoElement.videoWidth && videoElement.videoHeight) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
    }

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.videoElement) {
          await this.pose.send({ image: this.videoElement });
        }
      },
      width: 1280,
      height: 720,
    });

    this.camera.start();
  }

  public stopDetection(): void {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    this.onResultsCallback = null;
  }

  public getLandmark(index: number, landmarks: PoseLandmarks[]): PoseLandmarks | null {
    if (index >= 0 && index < landmarks.length) {
      return landmarks[index];
    }
    return null;
  }

  // Calculate distance between two landmarks
  public calculateDistance(
    landmark1: PoseLandmarks,
    landmark2: PoseLandmarks
  ): number {
    const dx = landmark1.x - landmark2.x;
    const dy = landmark1.y - landmark2.y;
    const dz = landmark1.z - landmark2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Calculate angle between three landmarks
  public calculateAngle(
    point1: PoseLandmarks,
    point2: PoseLandmarks,
    point3: PoseLandmarks
  ): number {
    const a = this.calculateDistance(point1, point2);
    const b = this.calculateDistance(point2, point3);
    const c = this.calculateDistance(point1, point3);

    // Use law of cosines
    const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    return (angle * 180) / Math.PI; // Convert to degrees
  }
}

// MediaPipe Pose landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

