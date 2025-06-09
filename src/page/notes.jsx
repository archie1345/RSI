import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// --- IMPORTANT NOTE ---
// Your primary key is 'Notes_ID'. This code has been updated to use 'Notes_ID' instead of 'id'.
// The main "Failed to save note" error is most likely due to a missing Row-Level Security policy for INSERT in Supabase.
// Please ensure you have created that policy.

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  });
  // --- NEW STATE to track submission ---
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // A check to make sure we don't fetch if the user object isn't ready.
    if (user) {
      fetchNotes();
    } else {
      // If there's no user, we're not loading anymore.
      setLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    // This check is important to prevent errors if the component renders before the user is available.
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data);
      setError('');
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(`Failed to load notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    
    // --- FIX: Add a guard clause to ensure user exists before trying to add a note ---
    if (!user) {
      setError("You must be logged in to add a note.");
      return;
    }

    if (!newNote.content.trim()) {
      setError('Note content cannot be empty');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({ 
          title: newNote.title,
          content: newNote.content,
          user_id: user.id 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '' });

    } catch (err) {
      console.error("Error saving note:", err);
      // This will now show the real error from Supabase, like "violates row-level security policy"
      setError(`Failed to save note: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('Notes_ID', noteId); // Using the correct primary key 'Notes_ID'

      if (error) throw error;

      setNotes(notes.filter(note => note.Notes_ID !== noteId)); // Using 'Notes_ID'
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(`Failed to delete note: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Daily Notes</h1>
      
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}

      <form onSubmit={addNote} className="mb-8">
        {/* --- FIX: Disable form elements if there is no user or a submission is in progress --- */}
        <fieldset disabled={!user || submitting}>
          <input
            type="text"
            placeholder="Note title (optional)"
            className="input input-bordered w-full mb-2"
            value={newNote.title}
            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
          />
          <textarea
            placeholder="What's on your mind today?"
            className="textarea textarea-bordered w-full mb-2"
            value={newNote.content}
            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
            rows={4}
          />
          <button type="submit" className="btn btn-primary">
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </fieldset>
      </form>

      {loading ? (
        <div className="text-center">Loading notes...</div>
      ) : !user ? (
        // --- Added a clear message for non-logged-in users ---
        <div className="text-center text-gray-500">Please sign in to view and add notes.</div>
      ) : notes.length === 0 ? (
        <div className="text-center text-gray-500">No notes yet. Add your first note!</div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.Notes_ID} className="card bg-base-100 shadow-md">
              <div className="card-body">
                {note.title && <h3 className="card-title">{note.title}</h3>}
                <p className="whitespace-pre-wrap">{note.content}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {new Date(note.created_at).toLocaleDateString('en-US', {
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </span>
                  <button 
                    onClick={() => deleteNote(note.Notes_ID)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
