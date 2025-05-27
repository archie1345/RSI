import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';

function notes() {
    const [notes, setNotes] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [editingNote, setEditingNote] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const data = await noteAPI.getNotes()
      setNotes(data)
    } catch (err) {
      setError('Failed to load notes')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Note cannot be empty!')
      return
    }

    try {
      if (editingNote) {
        await noteAPI.updateNote(editingNote.id, content)
      } else {
        await noteAPI.createNote(content)
      }
      setContent('')
      setError('')
      setShowForm(false)
      setEditingNote(null)
      await fetchNotes()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await noteAPI.deleteNote(id)
      await fetchNotes()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Personal Notes</h1>
        <button onClick={() => {
          setShowForm(true)
          setEditingNote(null)
          setContent('')
        }}>
          New Note
        </button>
      </header>

      {showForm && (
        <form className="note-form" onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note..."
          />
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="submit">{editingNote ? 'Update' : 'Save'} Note</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false)
                setEditingNote(null)
                setContent('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-item">
            <p className="note-content">{note.content}</p>
            <div className="note-date">
              {new Date(note.created_at).toLocaleString()}
            </div>
            <div className="note-actions">
              <button onClick={() => {
                setEditingNote(note)
                setContent(note.content)
                setShowForm(true)
              }}>
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default notes;