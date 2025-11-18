class VoiceFeedbackManager {
  private speechQueue: string[] = [];
  private isSpeaking = false;
  private lastFeedbackTime = 0;
  private lastMotivationalTime = 0;
  private feedbackCooldown = 2000; // 2 seconds between feedback messages
  private motivationalCooldown = 15000; // 15 seconds between motivational messages

  private speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.processQueue();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.processQueue();
    };

    window.speechSynthesis.speak(utterance);
    this.isSpeaking = true;
  }

  private processQueue(): void {
    if (this.speechQueue.length > 0 && !this.isSpeaking) {
      const nextMessage = this.speechQueue.shift();
      if (nextMessage) {
        this.speak(nextMessage);
      }
    }
  }

  public speakFeedback(message: string, force = false): void {
    const now = Date.now();
    
    if (!force && now - this.lastFeedbackTime < this.feedbackCooldown) {
      return; // Skip if too soon
    }

    this.lastFeedbackTime = now;

    if (this.isSpeaking) {
      this.speechQueue.push(message);
    } else {
      this.speak(message);
    }
  }

  public speakMotivational(message: string): void {
    const now = Date.now();
    
    if (now - this.lastMotivationalTime < this.motivationalCooldown) {
      return; // Skip if too soon
    }

    this.lastMotivationalTime = now;

    if (this.isSpeaking) {
      this.speechQueue.push(message);
    } else {
      this.speak(message);
    }
  }

  public stop(): void {
    window.speechSynthesis.cancel();
    this.speechQueue = [];
    this.isSpeaking = false;
  }

  public clearQueue(): void {
    this.speechQueue = [];
  }
}

export const voiceFeedback = new VoiceFeedbackManager();

