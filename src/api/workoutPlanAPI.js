// src/hooks/useWorkoutPlan.js or in your component
import { supabase } from '../supabaseClient'

export async function createWorkoutPlan(userId, level, duration, intensity) {
  const { data, error } = await supabase
    .from('WorkoutPlan')
    .insert([
      { userId, level, duration, intensity }
    ]);

  if (error) {
    console.error('Error inserting workout plan:', error.message);
    throw error;
  }

  return data;
}
