// src/api/calorieAPI.js
import { supabase } from '../supabaseClient';

export const calorieApi = {
  // Simpan hasil kalkulasi
  createCalorieResult: async (user_id, resultData) => {
    const { data, error } = await supabase
      .from('calorie_results')
      .insert([{ userid: user_id, ...resultData }])
      .select()
    
    if (error) throw new Error(error.message);
    return data[0];
  },

  // Ambil hasil terbaru
  getLatestResult: async (user_id) => {
    const { data, error } = await supabase
      .from('calorie_results')
      .select('*')
      .eq('userid', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Ambil semua riwayat (opsional)
  getAllResults: async (user_id) => {
    const { data, error } = await supabase
      .from('calorie_results')
      .select('*')
      .eq('userid', user_id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Realtime listener (opsional)
  subscribeToResults: (user_id, callback) => {
    return supabase
      .channel('realtime-calorie-results')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'calorie_results',
        filter: `userid=eq.${user_id}`
      }, callback)
      .subscribe();
  }
};
