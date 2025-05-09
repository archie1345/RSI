import { supabase } from '../supabaseClient.js'

// CREATE session
export const createSession = async (session) => {
  return await supabase.from('Session').insert([session])
}

// READ session(s)
export const getSessions = async () => {
  return await supabase.from('Session').select('*')
}

// UPDATE session
export const updateSession = async (sessionId, updates) => {
  return await supabase.from('Session').update(updates).eq('sessionId', sessionId)
}

// DELETE session
export const deleteSession = async (sessionId) => {
  return await supabase.from('Session').delete().eq('sessionId', sessionId)
}
