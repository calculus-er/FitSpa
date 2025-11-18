import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Play, Pause, BarChart3, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { useRepCounter } from '@/hooks/useRepCounter';
import { useFormAnalysis } from '@/hooks/useFormAnalysis';
import { useVoiceFeedback } from '@/hooks/useVoiceFeedback';
import { exercises, getExerciseById, Exercise } from '@/lib/workout/exerciseConfig';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutRecorder } from '@/lib/workout/workoutRecorder';

const Workout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const workoutRecorderRef = useRef<WorkoutRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  // Pose detection
  const { landmarks, isDetecting } = usePoseDetection({
    videoElement: videoRef.current,
    enabled: isWorkoutActive && hasPermission,
  });

  // Rep counting
  const { repCount, reset: resetRepCount, currentPhase } = useRepCounter({
    exercise: selectedExercise,
    landmarks,
    isActive: isWorkoutActive,
  });

  // Form analysis
  const { feedback, formScore } = useFormAnalysis({
    exercise: selectedExercise,
    landmarks,
    isActive: isWorkoutActive,
  });

  // Record form scores and feedback
  useEffect(() => {
    if (isWorkoutActive && workoutRecorderRef.current && formScore < 100) {
      workoutRecorderRef.current.addFormScore(formScore);
    }
  }, [formScore, isWorkoutActive]);

  useEffect(() => {
    if (isWorkoutActive && workoutRecorderRef.current && feedback.message !== 'Ready to start') {
      workoutRecorderRef.current.addFeedback(feedback.message, feedback.severity);
    }
  }, [feedback, isWorkoutActive]);

  // Update rep count in recorder
  useEffect(() => {
    if (isWorkoutActive && workoutRecorderRef.current) {
      workoutRecorderRef.current.updateReps(repCount);
    }
  }, [repCount, isWorkoutActive]);

  // Voice feedback
  useVoiceFeedback({
    enabled: voiceEnabled && isWorkoutActive,
    feedback,
    repCount,
    target: selectedExercise.target,
    formScore,
    exerciseName: selectedExercise.name,
    isActive: isWorkoutActive,
  });

  // Initialize workout recorder
  useEffect(() => {
    if (user) {
      workoutRecorderRef.current = new WorkoutRecorder(user.uid);
    } else {
      // Use a demo user ID for local testing without Firebase
      workoutRecorderRef.current = new WorkoutRecorder('demo-user');
    }
  }, [user]);

  useEffect(() => {
    requestCameraAccess();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      toast({
        title: 'Camera Access Required',
        description: 'Please allow camera access to track exercises',
        variant: 'destructive',
      });
    }
  };

  const toggleWorkout = async () => {
    if (!isWorkoutActive) {
      setIsWorkoutActive(true);
      setWorkoutStartTime(new Date());
      resetRepCount();
      
      // Start workout session
      if (workoutRecorderRef.current) {
        workoutRecorderRef.current.startSession(selectedExercise);
      }
    } else {
      // End workout session
      if (workoutRecorderRef.current) {
        try {
          await workoutRecorderRef.current.endSession();
          // Only show success toast if Firebase is configured
          if (user) {
            toast({
              title: 'Workout Saved',
              description: 'Your workout has been saved successfully',
            });
          }
        } catch (error: any) {
          // Only show error if it's not a demo user (Firebase not configured)
          if (user) {
            toast({
              title: 'Error',
              description: error.message || 'Failed to save workout',
              variant: 'destructive',
            });
          }
        }
      }
      
      setIsWorkoutActive(false);
      setWorkoutStartTime(null);
    }
  };

  const handleExerciseChange = (exercise: Exercise) => {
    if (!isWorkoutActive) {
      setSelectedExercise(exercise);
      resetRepCount();
    }
  };

  const getFeedbackColor = () => {
    if (feedback.severity === 'good') return 'text-success';
    if (feedback.severity === 'warning') return 'text-warning';
    return 'text-destructive';
  };

  const getFeedbackBgColor = () => {
    if (feedback.severity === 'good') return 'bg-success/10 border-success/20';
    if (feedback.severity === 'warning') return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Fitness Coach</h1>
              <p className="text-sm text-muted-foreground">Live Workout Session</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => {
                try {
                  await logout();
                  toast({
                    title: 'Logged out',
                    description: 'You have been logged out successfully',
                  });
                  navigate('/');
                } catch (error: any) {
                  toast({
                    title: 'Error',
                    description: error.message || 'Failed to log out',
                    variant: 'destructive',
                  });
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-border bg-card/80 backdrop-blur-xl shadow-elegant">
              <div className="relative aspect-video bg-secondary">
                {hasPermission ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {isDetecting && (
                      <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        AI Tracking Active
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Requesting camera access...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Controls */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{selectedExercise.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Target: {selectedExercise.target} {selectedExercise.id === 'plank' ? 'seconds' : 'reps'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      title={voiceEnabled ? 'Disable voice feedback' : 'Enable voice feedback'}
                    >
                      {voiceEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant={isWorkoutActive ? "accent" : "hero"}
                      size="lg"
                      onClick={toggleWorkout}
                      disabled={!hasPermission}
                      className="min-w-[140px]"
                    >
                      {isWorkoutActive ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rep Counter */}
            <Card className="p-6 border-border bg-card/80 backdrop-blur-xl text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {selectedExercise.id === 'plank' ? 'Time Elapsed' : 'Reps Completed'}
              </p>
              <div className="text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-counter-bounce">
                {repCount}
              </div>
              <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${Math.min((repCount / selectedExercise.target) * 100, 100)}%` }}
                />
              </div>
              {formScore < 100 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-1">Form Score</p>
                  <div className="text-2xl font-bold" style={{ color: formScore >= 70 ? 'hsl(var(--success))' : formScore >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))' }}>
                    {Math.round(formScore)}%
                  </div>
                </div>
              )}
            </Card>

            {/* Feedback */}
            <Card className="p-6 border-border bg-card/80 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Live Feedback</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border ${getFeedbackBgColor()}`}>
                  <p className={`text-sm ${getFeedbackColor()}`}>
                    {feedback.severity === 'good' && '✓ '}
                    {feedback.message}
                  </p>
                </div>
                {currentPhase && (
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-sm text-muted-foreground">
                      Phase: <span className="font-semibold capitalize">{currentPhase}</span>
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Exercise Selection */}
            <Card className="p-6 border-border bg-card/80 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Select Exercise</h3>
              <div className="space-y-2">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseChange(exercise)}
                    disabled={isWorkoutActive}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedExercise.id === exercise.id
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-secondary hover:bg-secondary/80'
                    } disabled:opacity-50`}
                  >
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-xs opacity-80">
                      {exercise.target} {exercise.id === 'plank' ? 'seconds' : 'reps'}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workout;
