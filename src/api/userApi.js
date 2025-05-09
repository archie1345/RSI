import { supabase } from '../supabaseClient'

// CREATE user
export const createUser = async (user) => {
  return await supabase.from('User').insert([user])
}

// READ user(s)
export const getUsers = async () => {
  return await supabase.from('User').select('*')
}

// UPDATE user
export const updateUser = async (userId, updates) => {
  return await supabase.from('User').update(updates).eq('userId', userId)
}

// DELETE user
export const deleteUser = async (userId) => {
  return await supabase.from('User').delete().eq('userId', userId)
}
