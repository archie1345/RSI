import { supabase } from '../supabaseClient';

// Fetch workout plans for a given user ID
export async function fetchWorkoutPlans(userId) {
  if (!userId) return { data: [], error: null };

  // You do NOT need to get the user again here if userId is passed in
  // const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('WorkoutPlan')  // Make sure this matches your actual table name exactly, case sensitive
    .select('*')
    .eq('userid', userId);

  console.log('Query error:', error);
  console.log('Plans returned:', data);

  return { data, error };
}


// Create a new workout plan for a user
export async function createWorkoutPlan(userId, level, duration, intensity) {
  const payload = {
    userid: userId,
    level,
    duration,
    intensity
  };

  const { data, error } = await supabase
    .from('WorkoutPlan')
    .insert([payload]);

  if (error) {
    console.error('Error inserting workout plan:', error.message);
    throw error;
  }

  return data;
}
