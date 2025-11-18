import { useEffect, useRef } from 'react';
import { voiceFeedback } from '@/lib/voice/voiceFeedback';
import { getFeedbackMessage, getRepCountMessage, getFormScoreMessage } from '@/lib/voice/feedbackMessages';
import { getRandomMotivationalMessage } from '@/lib/voice/motivationalMessages';
import { FormFeedback } from '@/lib/exercises/formValidator';

interface UseVoiceFeedbackOptions {
  enabled: boolean;
  feedback: FormFeedback;
  repCount: number;
  target: number;
  formScore: number;
  exerciseName: string;
  isActive: boolean;
}

export const useVoiceFeedback = ({
  enabled,
  feedback,
  repCount,
  target,
  formScore,
  exerciseName,
  isActive,
}: UseVoiceFeedbackOptions) => {
  const previousRepCountRef = useRef(0);
  const previousFormScoreRef = useRef(100);
  const motivationalIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isActive) {
      voiceFeedback.stop();
      if (motivationalIntervalRef.current) {
        clearInterval(motivationalIntervalRef.current);
        motivationalIntervalRef.current = null;
      }
      return;
    }

    // Speak feedback messages when form changes
    if (feedback.severity === 'error' || feedback.severity === 'warning') {
      const message = getFeedbackMessage(feedback, exerciseName);
      voiceFeedback.speakFeedback(message);
    }

    // Speak rep count updates
    if (repCount !== previousRepCountRef.current) {
      const repMessage = getRepCountMessage(repCount, target);
      if (repMessage) {
        voiceFeedback.speakFeedback(repMessage);
      }
      previousRepCountRef.current = repCount;
    }

    // Speak form score updates (when it changes significantly)
    if (Math.abs(formScore - previousFormScoreRef.current) > 10) {
      const scoreMessage = getFormScoreMessage(formScore);
      if (scoreMessage && formScore < 70) {
        voiceFeedback.speakFeedback(scoreMessage);
      }
      previousFormScoreRef.current = formScore;
    }

    // Set up motivational messages interval (every 20-30 seconds)
    if (!motivationalIntervalRef.current) {
      motivationalIntervalRef.current = setInterval(() => {
        const message = getRandomMotivationalMessage();
        voiceFeedback.speakMotivational(message);
      }, 20000 + Math.random() * 10000); // Random between 20-30 seconds
    }

    return () => {
      if (motivationalIntervalRef.current) {
        clearInterval(motivationalIntervalRef.current);
        motivationalIntervalRef.current = null;
      }
    };
  }, [enabled, feedback, repCount, target, formScore, exerciseName, isActive]);

  useEffect(() => {
    return () => {
      voiceFeedback.stop();
      if (motivationalIntervalRef.current) {
        clearInterval(motivationalIntervalRef.current);
        motivationalIntervalRef.current = null;
      }
    };
  }, []);
};

