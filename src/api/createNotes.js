import { createClient } from '@supabase/supabase-js'

export const api = {
  getNotes: async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  addNote: async (content) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ content }])
    
    if (error) throw error
    return data
  },

  deleteNote: async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}