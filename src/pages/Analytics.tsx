import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Calendar, Target, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data
const weeklyData = [
  { day: 'Mon', reps: 85, duration: 25 },
  { day: 'Tue', reps: 95, duration: 30 },
  { day: 'Wed', reps: 78, duration: 22 },
  { day: 'Thu', reps: 110, duration: 35 },
  { day: 'Fri', reps: 125, duration: 40 },
  { day: 'Sat', reps: 105, duration: 32 },
  { day: 'Sun', reps: 92, duration: 28 },
];

const exerciseStats = [
  { exercise: 'Push-ups', completed: 420, target: 500 },
  { exercise: 'Squats', completed: 680, target: 750 },
  { exercise: 'Plank', completed: 180, target: 200 },
  { exercise: 'Lunges', completed: 340, target: 400 },
];

const Analytics = () => {
  const navigate = useNavigate();

  const totalWorkouts = 28;
  const totalReps = 2840;
  const totalMinutes = 672;
  const streak = 7;

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
              <p className="text-sm text-muted-foreground mt-1">This month</p>
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
              <p className="text-sm text-muted-foreground mt-1">Minutes this month</p>
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
              <CardDescription>Progress towards monthly goals</CardDescription>
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

        {/* Recent Achievements */}
        <Card className="mt-6 border-border bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: '7-Day Streak', desc: 'Worked out for 7 consecutive days', icon: Flame, color: 'destructive' },
                { title: 'Century Club', desc: 'Completed 100 push-ups in a session', icon: Target, color: 'primary' },
                { title: 'Perfect Form', desc: 'Achieved 95% form accuracy for a workout', icon: TrendingUp, color: 'success' },
              ].map((achievement, index) => (
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
