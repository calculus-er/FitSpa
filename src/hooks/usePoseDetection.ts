import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseDetector, PoseLandmarks, PoseResults } from '@/lib/pose-detection/poseDetector';

interface UsePoseDetectionOptions {
  videoElement: HTMLVideoElement | null;
  enabled?: boolean;
  onResults?: (results: PoseResults) => void;
}

export const usePoseDetection = ({
  videoElement,
  enabled = false,
  onResults,
}: UsePoseDetectionOptions) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [landmarks, setLandmarks] = useState<PoseLandmarks[] | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize detector
  useEffect(() => {
    if (!detectorRef.current) {
      detectorRef.current = new PoseDetector();
    }

    return () => {
      if (detectorRef.current) {
        detectorRef.current.stopDetection();
      }
    };
  }, []);

  // Handle pose detection results
  const handleResults = useCallback(
    (results: PoseResults) => {
      setLandmarks(results.landmarks);
      if (onResults) {
        onResults(results);
      }
    },
    [onResults]
  );

  // Start/stop detection based on enabled flag
  useEffect(() => {
    if (!videoElement || !detectorRef.current || !enabled) {
      if (detectorRef.current && isDetecting) {
        detectorRef.current.stopDetection();
        setIsDetecting(false);
      }
      return;
    }

    // Create canvas element if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '10';
      
      // Find video container and append canvas
      const videoContainer = videoElement.parentElement;
      if (videoContainer) {
        videoContainer.style.position = 'relative';
        videoContainer.appendChild(canvas);
        canvasRef.current = canvas;
      }
    }

    if (canvasRef.current && !isDetecting) {
      detectorRef.current.startDetection(videoElement, canvasRef.current, handleResults);
      setIsDetecting(true);
    }

    return () => {
      if (detectorRef.current && isDetecting) {
        detectorRef.current.stopDetection();
        setIsDetecting(false);
      }
    };
  }, [videoElement, enabled, isDetecting, handleResults]);

  return {
    landmarks,
    isDetecting,
    detector: detectorRef.current,
  };
};

