import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
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
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.content.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          title: newNote.title,
          content: newNote.content,
          user_id: user.id 
        }]);

      if (error) throw error;
      
      setNotes([data[0], ...notes]);
      setNewNote({ title: '', content: '' });
      setError('');
    } catch (err) {
      setError('Failed to save note');
    }
  };

  const deleteNote = async (id) => {
    try {
      await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Daily Notes</h1>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={addNote} className="mb-8">
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
          Add Note
        </button>
      </form>

      {loading ? (
        <div className="text-center">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center text-gray-500">No notes yet. Add your first note!</div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="card bg-base-100 shadow-md">
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
                    onClick={() => deleteNote(note.id)}
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