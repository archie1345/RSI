import { supabase } from './supabaseClient'

export const notesApi = {
  // Create new note
  createNote: async (user_id, { title, content }) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ 
        title,
        content,
        user_id 
      }])
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  },

  // Get all notes for user
  getNotes: async (user_id) => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  // Update existing note
  updateNote: async (id, updates) => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  },

  // Delete note
  deleteNote: async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return true
  },

  // Subscribe to realtime changes
  subscribeToNotes: (userId, callback) => {
    return supabase
      .channel('custom-all-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}