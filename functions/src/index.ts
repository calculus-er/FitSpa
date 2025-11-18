import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Example Cloud Function for processing workout data
export const processWorkoutData = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { workoutId, exerciseData } = data;
  const userId = context.auth.uid;

  try {
    // Process workout data
    const processedData = {
      userId,
      workoutId,
      exerciseData,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      metrics: calculateWorkoutMetrics(exerciseData)
    };

    // Save to Firestore
    await admin.firestore()
      .collection("users")
      .doc(userId)
      .collection("workouts")
      .doc(workoutId)
      .set(processedData, { merge: true });

    return { success: true, metrics: processedData.metrics };
  } catch (error) {
    console.error("Error processing workout data:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error processing workout data"
    );
  }
});

// Example function for generating analytics reports
export const generateAnalyticsReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const userId = context.auth.uid;
  const { timeframe } = data; // e.g., 'week', 'month', 'year'

  try {
    const workoutsSnapshot = await admin.firestore()
      .collection("users")
      .doc(userId)
      .collection("workouts")
      .where("processedAt", ">=", getTimeframeStart(timeframe))
      .get();

    const analytics = generateAnalytics(workoutsSnapshot);
    
    return { success: true, analytics };
  } catch (error) {
    console.error("Error generating analytics:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error generating analytics report"
    );
  }
});

// Helper function to calculate workout metrics
function calculateWorkoutMetrics(exerciseData: any) {
  // Implement your workout metrics calculation logic here
  return {
    totalReps: exerciseData.reduce((sum: number, exercise: any) => sum + exercise.reps, 0),
    totalDuration: exerciseData.reduce((sum: number, exercise: any) => sum + exercise.duration, 0),
    caloriesBurned: Math.floor(Math.random() * 500) + 200, // Placeholder calculation
    formScore: calculateFormScore(exerciseData)
  };
}

// Helper function to calculate form score
function calculateFormScore(exerciseData: any) {
  // Implement form scoring logic based on pose detection data
  const totalFormScore = exerciseData.reduce((sum: number, exercise: any) => {
    return sum + (exercise.formScore || 0);
  }, 0);
  return Math.round(totalFormScore / exerciseData.length);
}

// Helper function to get timeframe start date
function getTimeframeStart(timeframe: string) {
  const now = new Date();
  switch (timeframe) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

// Helper function to generate analytics
function generateAnalytics(workoutsSnapshot: any) {
  const workouts = workoutsSnapshot.docs.map((doc: any) => doc.data());
  
  return {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((sum: number, workout: any) => sum + (workout.metrics?.totalDuration || 0), 0),
    totalCalories: workouts.reduce((sum: number, workout: any) => sum + (workout.metrics?.caloriesBurned || 0), 0),
    averageFormScore: workouts.length > 0 
      ? Math.round(workouts.reduce((sum: number, workout: any) => sum + (workout.metrics?.formScore || 0), 0) / workouts.length)
      : 0,
    workoutsPerWeek: calculateWorkoutsPerWeek(workouts)
  };
}

// Helper function to calculate workouts per week
function calculateWorkoutsPerWeek(workouts: any[]) {
  if (workouts.length === 0) return 0;
  
  const dates = workouts.map(workout => workout.processedAt?.toDate()).filter(Boolean);
  if (dates.length === 0) return 0;
  
  const oldestDate = new Date(Math.min(...dates.map((date: Date) => date.getTime())));
  const weeksDiff = (Date.now() - oldestDate.getTime()) / (7 * 24 * 60 * 60 * 1000);
  
  return Math.round(workouts.length / Math.max(weeksDiff, 1));
}
