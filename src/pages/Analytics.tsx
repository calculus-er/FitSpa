import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Calendar, Target, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { exercises } from '@/lib/workout/exerciseConfig';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { analytics, loading } = useAnalytics(user?.uid || null);

  // Format weekly data for chart
  const weeklyData = analytics?.weeklyStats?.map((stat) => {
    const date = new Date(stat.date);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: dayNames[date.getDay()],
      reps: stat.reps,
      duration: stat.duration,
    };
  }) || [];

  // Format exercise stats
  const exerciseStats = exercises.map((exercise) => {
    const stats = analytics?.exerciseStats?.[exercise.id] || { completed: 0, target: 0 };
    return {
      exercise: exercise.name,
      completed: stats.completed,
      target: exercise.target * (analytics?.totalWorkouts || 0), // Estimate target based on workouts
    };
  });

  const totalWorkouts = analytics?.totalWorkouts || 0;
  const totalReps = analytics?.totalReps || 0;
  const totalMinutes = analytics?.totalMinutes || 0;
  const streak = analytics?.currentStreak || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      {/* Header */}
      <header className="relative z-20 border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/workout')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workout
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Your Analytics</h1>
            <p className="text-muted-foreground">Track your progress and achievements</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border bg-card/80 backdrop-blur-xl hover:shadow-glow transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Workouts</CardDescription>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{totalWorkouts}</div>
              <p className="text-sm text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-xl hover:shadow-glow transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Reps</CardDescription>
                <Target className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{totalReps.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">All exercises</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-xl hover:shadow-glow transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Training Time</CardDescription>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success">{totalMinutes}</div>
              <p className="text-sm text-muted-foreground mt-1">Minutes total</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-xl hover:shadow-glow transition-all hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Current Streak</CardDescription>
                <Flame className="w-5 h-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">{streak}</div>
              <p className="text-sm text-muted-foreground mt-1">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {weeklyData.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekly Progress Chart */}
            <Card className="border-border bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="reps" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                      name="Reps"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', r: 5 }}
                      name="Duration (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Exercise Breakdown */}
            <Card className="border-border bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Exercise Breakdown</CardTitle>
                <CardDescription>Progress across different exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exerciseStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="exercise" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="completed" 
                      fill="hsl(var(--success))" 
                      radius={[8, 8, 0, 0]}
                      name="Completed"
                    />
                    <Bar 
                      dataKey="target" 
                      fill="hsl(var(--muted))" 
                      radius={[8, 8, 0, 0]}
                      name="Target"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-border bg-card/80 backdrop-blur-xl">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No workout data yet. Start your first workout to see analytics!</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        <Card className="mt-6 border-border bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                streak >= 7 && { title: '7-Day Streak', desc: 'Worked out for 7 consecutive days', icon: Flame, color: 'destructive' },
                totalReps >= 100 && { title: 'Century Club', desc: 'Completed 100 reps in total', icon: Target, color: 'primary' },
                totalWorkouts >= 10 && { title: 'Consistency King', desc: 'Completed 10 workouts', icon: TrendingUp, color: 'success' },
              ].filter(Boolean).map((achievement: any, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className={`p-3 rounded-lg bg-${achievement.color}/10`}>
                    <achievement.icon className={`w-6 h-6 text-${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                  </div>
                  <div className="text-2xl">🏆</div>
                </div>
              ))}
              {streak < 7 && totalReps < 100 && totalWorkouts < 10 && (
                <p className="text-center text-muted-foreground py-8">
                  Keep working out to unlock achievements!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
