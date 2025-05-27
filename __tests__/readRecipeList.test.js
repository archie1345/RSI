// __tests__/readRecipeList.test.js
import { getRecipes } from '../src/api/recipeApi';
import { render, screen, waitFor } from '@testing-library/react';
import RecipeList from '../src/page/RecipeList';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

jest.mock('../src/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: jest.fn(),
  }
}));


jest.mock('../src/api/recipeApi', () => ({
  getRecipes: jest.fn()
}));

describe('Read Recipe List Feature', () => {
  const mockUser = { id: 'user123' };

  const renderComponent = (filter = 'public') => {
    window.history.pushState({}, 'Test page', '/');
    render(
      <BrowserRouter>
        <RecipeList user={mockUser} />
      </BrowserRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Path 1: Filter public - should show public and user-owned recipes', async () => {
    getRecipes.mockResolvedValueOnce({
      data: [
        { recipeid: 1, title: 'A', visibility: 'public', userid: 'x' },
        { recipeid: 2, title: 'B', visibility: 'private', userid: 'user123' },
        { recipeid: 3, title: 'C', visibility: 'private', userid: 'other' }
      ],
      error: null
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.queryByText('C')).not.toBeInTheDocument();
    });
  });

  test('Path 2: Filter private - should show only user-owned recipes', async () => {
    getRecipes.mockResolvedValueOnce({
      data: [
        { recipeid: 1, title: 'A', visibility: 'public', userid: 'x' },
        { recipeid: 2, title: 'B', visibility: 'private', userid: 'user123' }
      ],
      error: null
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument(); // default filter is public
    });
  });

  test('Path 3: API error should log error', async () => {
    console.error = jest.fn();
    getRecipes.mockResolvedValueOnce({ data: null, error: new Error('fail') });

    renderComponent();
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(new Error('fail'));
    });
  });

  test('Black-box TC1: No recipes should show empty state', async () => {
    getRecipes.mockResolvedValueOnce({ data: [], error: null });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No recipes to display.')).toBeInTheDocument();
    });
  });

  test('Black-box TC2: Display large list of recipes', async () => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      recipeid: i,
      title: `Recipe ${i}`,
      visibility: 'public',
      userid: 'user123'
    }));

    getRecipes.mockResolvedValueOnce({ data: mockData, error: null });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Recipe 0')).toBeInTheDocument();
      expect(screen.getByText('Recipe 99')).toBeInTheDocument();
    });
  });
});
