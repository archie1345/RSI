import { supabase } from '../supabaseClient.js'

// CREATE session
export const createStep = async (stepData) => {
  return await supabase.from('Step').insert([stepData])
}

// READ session(s)
export const getSteps = async () => {
  return await supabase.from('Step').select('*')
}

// UPDATE session
export const updateSteps = async (stepid, updates) => {
  return await supabase.from('Step').update(updates).eq('stepid', stepid)
}

// DELETE session
export const deleteSteps = async (stepid) => {
  return await supabase.from('Step').delete().eq('stepid', stepid)
}