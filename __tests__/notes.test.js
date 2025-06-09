import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notes from '../src/page/notes';
import { supabase } from '../src/supabaseClient';

// FIX: A more robust, chain-aware mock setup for the Supabase client.
// All chainable methods return `this` to allow chaining like in the real client.
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn(), // This is a terminal method for fetch, will be mocked in tests
    single: jest.fn(), // This is a terminal method for insert, will be mocked in tests
  },
}));

// A helper function to access the mocked Supabase functions
const supabaseMock = supabase;

describe('Notes Component', () => {
  const mockUser = { id: '12345', email: 'test@example.com' };
  const mockNotes = [
    { Notes_ID: 1, title: 'First Note', content: 'This is the first note.', created_at: '2025-06-09T10:00:00.000Z', user_id: '12345' },
    { Notes_ID: 2, title: '', content: 'This is a note without a title.', created_at: '2025-06-08T10:00:00.000Z', user_id: '12345' },
  ];

  beforeEach(() => {
    // This resets call counts but doesn't remove mock implementations.
    jest.clearAllMocks();
  });

  // =================================================================
  // --- White-Box Testing: Basis Path Test Cases ---
  // =================================================================
  describe('White-Box: Basis Path Testing', () => {

    test('Path 1: Component loads when no user is logged in', () => {
      render(<Notes user={null} />);
      expect(screen.getByText('Please sign in to view and add notes.')).toBeInTheDocument();
      expect(supabaseMock.from).not.toHaveBeenCalled();
    });

    test('Path 2: A logged-in user successfully fetches existing notes', async () => {
      supabaseMock.order.mockResolvedValueOnce({ data: mockNotes, error: null });
      render(<Notes user={mockUser} />);
      // FIX: Use findBy* for robust async queries.
      await screen.findByText('First Note');
    });
    
    test('Path 3: API call to fetch notes fails', async () => {
      const mockError = { message: 'Network error' };
      supabaseMock.order.mockResolvedValueOnce({ data: null, error: mockError });
      render(<Notes user={mockUser} />);
      // FIX: Use findBy* for robust async queries.
      await screen.findByText(/Failed to load notes: Network error/i);
    });

    test('Path 4: A logged-in user successfully adds a new note', async () => {
      const newNote = { Notes_ID: 3, title: 'New Test Note', content: 'A new note.', created_at: new Date().toISOString(), user_id: mockUser.id };
      supabaseMock.order.mockResolvedValueOnce({ data: mockNotes, error: null });
      supabaseMock.single.mockResolvedValueOnce({ data: newNote, error: null });

      render(<Notes user={mockUser} />);
      // FIX: Use findBy* to wait for the initial notes to render.
      await screen.findByText('First Note');

      fireEvent.change(screen.getByPlaceholderText("What's on your mind today?"), { target: { value: newNote.content } });
      fireEvent.click(screen.getByRole('button', { name: /add note/i }));

      // FIX: Use findBy* to wait for the new note to appear after the state update.
      await screen.findByText('New Test Note');
    });

    test('Path 5: User tries to add a note with empty content', async () => {
      render(<Notes user={mockUser} />);
      fireEvent.click(screen.getByRole('button', { name: /add note/i }));
      // FIX: Use findBy* for robust async queries.
      await screen.findByText('Note content cannot be empty');
      expect(supabaseMock.insert).not.toHaveBeenCalled();
    });

    test('Path 6: API call to add a note fails', async () => {
        const mockError = { message: 'RLS policy violation' };
        supabaseMock.order.mockResolvedValueOnce({ data: [], error: null }); // Initial fetch
        supabaseMock.single.mockResolvedValueOnce({ data: null, error: mockError });

        render(<Notes user={mockUser} />);
        fireEvent.change(screen.getByPlaceholderText("What's on your mind today?"), { target: { value: 'This will fail' } });
        fireEvent.click(screen.getByRole('button', { name: /add note/i }));

        // FIX: Use findBy* for robust async queries.
        await screen.findByText(/Failed to save note: RLS policy violation/i);
    });

    test('Path 7: A user successfully deletes a note', async () => {
        // 1. Mock ONLY the initial fetch operation.
        supabaseMock.order.mockResolvedValueOnce({ data: [...mockNotes], error: null });

        render(<Notes user={mockUser} />);
        
        // 2. Wait for the fetch to complete and the component to render.
        const noteContent = await screen.findByText('This is the first note.');
        
        // 3. NOW, specifically mock the delete operation's terminal method.
        supabaseMock.eq.mockResolvedValueOnce({ error: null });

        // 4. Find the button and click it.
        const cardBody = noteContent.closest('.card-body');
        const deleteButton = cardBody.querySelector('button');
        fireEvent.click(deleteButton);

        // 5. Assert the note is gone.
        await waitFor(() => {
          expect(screen.queryByText('This is the first note.')).not.toBeInTheDocument();
        });

        // 6. Assert that the correct Supabase calls were made for delete.
        expect(supabaseMock.delete).toHaveBeenCalled();
        expect(supabaseMock.eq).toHaveBeenCalledWith('Notes_ID', mockNotes[0].Notes_ID);
    });
  
    test('Path 8: API call to delete a note fails', async () => {
        const mockError = { message: 'DB error' };
        // 1. Mock ONLY the initial fetch operation.
        supabaseMock.order.mockResolvedValueOnce({ data: [...mockNotes], error: null });

        render(<Notes user={mockUser} />);
        
        // 2. Wait for the fetch to complete and the component to render.
        const noteContent = await screen.findByText('This is the first note.');
        
        // 3. NOW, specifically mock the delete operation's terminal method.
        supabaseMock.eq.mockResolvedValueOnce({ error: mockError });
        
        // 4. Find the button and click it.
        const cardBody = noteContent.closest('.card-body');
        const deleteButton = cardBody.querySelector('button');
        fireEvent.click(deleteButton);
        
        // 5. Assert the error message appears and the note is still there.
        await screen.findByText(/Failed to delete note: DB error/i);
        expect(screen.getByText('This is the first note.')).toBeInTheDocument();
    });
  });

  // =================================================================
  // --- Black-Box Testing: Equivalence Partitioning ---
  // =================================================================
  describe('Black-Box: Equivalence Partitioning', () => {
    beforeEach(() => {
        supabaseMock.order.mockResolvedValue({ data: [], error: null });
    });

    test('Partition (Valid): Add a note with standard text content', async () => {
        const newNote = { Notes_ID: 4, title: 'Valid Title', content: 'Valid content.', created_at: new Date().toISOString(), user_id: mockUser.id };
        supabaseMock.single.mockResolvedValueOnce({ data: newNote, error: null });
        
        render(<Notes user={mockUser} />);
        // FIX: Wait for the button inside the form, which is more robust.
        await screen.findByRole('button', { name: /add note/i });

        fireEvent.change(screen.getByPlaceholderText("What's on your mind today?"), { target: { value: newNote.content } });
        fireEvent.click(screen.getByRole('button', { name: /add note/i }));

        await screen.findByText('Valid content.');
    });
    
    test('Partition (Invalid): Attempt to add a note with only whitespace content', async () => {
        render(<Notes user={mockUser} />);
        // FIX: Wait for the button inside the form, which is more robust.
        await screen.findByRole('button', { name: /add note/i });
        
        fireEvent.change(screen.getByPlaceholderText("What's on your mind today?"), { target: { value: '   \n   ' } });
        fireEvent.click(screen.getByRole('button', { name: /add note/i }));

        await screen.findByText('Note content cannot be empty');
        expect(supabaseMock.insert).not.toHaveBeenCalled();
    });
  });
});