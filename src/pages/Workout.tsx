import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Play, Pause, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const exercises = [
  { id: 'pushup', name: 'Push-ups', target: 20 },
  { id: 'squat', name: 'Squats', target: 30 },
  { id: 'plank', name: 'Plank Hold', target: 60 },
  { id: 'lunges', name: 'Lunges', target: 24 },
];

const Workout = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState('Ready to start');

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
      setFeedback('Camera access required to track exercises');
    }
  };

  const toggleWorkout = () => {
    if (!isWorkoutActive) {
      setIsWorkoutActive(true);
      setFeedback('Tracking your form...');
      // Simulate rep counting for demo
      const interval = setInterval(() => {
        setRepCount(prev => {
          if (prev >= selectedExercise.target) {
            clearInterval(interval);
            setIsWorkoutActive(false);
            setFeedback('Great job! Set complete!');
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      setIsWorkoutActive(false);
      setFeedback('Workout paused');
    }
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
              onClick={() => navigate('/')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
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
                    {/* Skeleton Overlay Simulation */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Animated skeleton points */}
                        <circle cx="50" cy="20" r="2" fill="currentColor" className="text-primary animate-glow-pulse" />
                        <circle cx="45" cy="30" r="2" fill="currentColor" className="text-primary animate-glow-pulse" />
                        <circle cx="55" cy="30" r="2" fill="currentColor" className="text-primary animate-glow-pulse" />
                        <circle cx="40" cy="45" r="2" fill="currentColor" className="text-success animate-glow-pulse" />
                        <circle cx="60" cy="45" r="2" fill="currentColor" className="text-success animate-glow-pulse" />
                        <line x1="50" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary/50" />
                        <line x1="50" y1="30" x2="40" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-primary/50" />
                        <line x1="50" y1="30" x2="60" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-primary/50" />
                      </svg>
                    </div>
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
                      Target: {selectedExercise.target} reps
                    </p>
                  </div>
                  
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
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rep Counter */}
            <Card className="p-6 border-border bg-card/80 backdrop-blur-xl text-center">
              <p className="text-sm text-muted-foreground mb-2">Reps Completed</p>
              <div className="text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-counter-bounce">
                {repCount}
              </div>
              <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${Math.min((repCount / selectedExercise.target) * 100, 100)}%` }}
                />
              </div>
            </Card>

            {/* Feedback */}
            <Card className="p-6 border-border bg-card/80 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Live Feedback</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm text-success">✓ Good form detected</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm">{feedback}</p>
                </div>
              </div>
            </Card>

            {/* Exercise Selection */}
            <Card className="p-6 border-border bg-card/80 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Select Exercise</h3>
              <div className="space-y-2">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      setSelectedExercise(exercise);
                      setRepCount(0);
                      setFeedback('Ready to start');
                    }}
                    disabled={isWorkoutActive}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedExercise.id === exercise.id
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-secondary hover:bg-secondary/80'
                    } disabled:opacity-50`}
                  >
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-xs opacity-80">{exercise.target} reps</p>
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
