// __tests__/readRecipeList.test.js
import { getRecipes } from '../src/api/recipeApi';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RecipeList from '../src/page/RecipeList';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { supabase } from '../src/supabaseClient';

// Mock API functions
jest.mock('../src/api/recipeApi', () => ({
  getRecipes: jest.fn(),
}));

jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RecipeList Component Tests (CRUD - READ)', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockPublicRecipe = { recipeid: 1, title: 'Public Dish', visibility: 'public', userid: 'other-user-1' };
  const mockPrivateOwnedRecipe = { recipeid: 2, title: 'My Secret Recipe', visibility: 'private', userid: mockUser.id };
  const mockPrivateOtherRecipe = { recipeid: 3, title: 'Someone Else\'s Private Recipe', visibility: 'private', userid: 'other-user-2' };
  const allMockRecipes = [mockPublicRecipe, mockPrivateOwnedRecipe, mockPrivateOtherRecipe];

  let consoleErrorSpy;

  const renderComponent = (user = mockUser, initialEntries = ['/']) => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <RecipeList user={user} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getRecipes.mockResolvedValue({ data: allMockRecipes, error: null });
    supabase.auth.signOut.mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('rp-wb-re-tc1: Should fetch and display public + owned recipes', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(mockPublicRecipe.title)).toBeInTheDocument();
      expect(screen.getByText(mockPrivateOwnedRecipe.title)).toBeInTheDocument();
      expect(screen.queryByText(mockPrivateOtherRecipe.title)).not.toBeInTheDocument();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test('rp-wb-re-tc2: Should apply public filter on default view', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(mockPublicRecipe.title)).toBeInTheDocument();
      expect(screen.getByText(mockPrivateOwnedRecipe.title)).toBeInTheDocument();
    });
  });

  test('rp-wb-re-tc3: Should apply private filter and show only owned recipes', async () => {
    renderComponent();
    await waitFor(() => screen.getByText(mockPublicRecipe.title));
    fireEvent.click(screen.getByRole('button', { name: 'Private' }));
    await waitFor(() => {
      expect(screen.queryByText(mockPublicRecipe.title)).not.toBeInTheDocument();
      expect(screen.getByText(mockPrivateOwnedRecipe.title)).toBeInTheDocument();
      expect(screen.queryByText(mockPrivateOtherRecipe.title)).not.toBeInTheDocument();
    });
  });

  test('rp-wb-re-tc4: Should redirect to login if user is null (useEffect 2)', async () => {
    renderComponent(null);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('rp-wb-re-tc5: Should not attempt filtering if user is null (useEffect 3)', async () => {
    renderComponent(null);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    expect(screen.getByText('No recipes to display.')).toBeInTheDocument();
  });

  test('rp-wb-re-tc6: Should not redirect when user is present', async () => {
    renderComponent(mockUser);
    await waitFor(() => expect(getRecipes).toHaveBeenCalled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('rp-wb-re-tc7: Logout triggers Supabase signOut', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('Logout'));
    fireEvent.click(screen.getByText('Logout'));
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  test('rp-bb-re-tc1: Empty data should show fallback text', async () => {
    getRecipes.mockResolvedValueOnce({ data: [], error: null });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No recipes to display.')).toBeInTheDocument();
    });
  });

  test('rp-bb-re-tc2: Should render a large number of recipes correctly', async () => {
    const largeMockData = Array.from({ length: 100 }, (_, i) => ({
      recipeid: i,
      title: `Recipe ${i}`,
      visibility: 'public',
      userid: 'test-user',
    }));
    getRecipes.mockResolvedValueOnce({ data: largeMockData, error: null });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Recipe 0')).toBeInTheDocument();
      expect(screen.getByText('Recipe 99')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(100);
    });
  });

  test('rp-bb-re-tc3: Clicking recipe should navigate to detail page', async () => {
    renderComponent();
    await waitFor(() => screen.getByText(mockPublicRecipe.title));
    fireEvent.click(screen.getByText(mockPublicRecipe.title));
    expect(mockNavigate).toHaveBeenCalledWith(`/recipe/${mockPublicRecipe.recipeid}`);
  });

  test('rp-bb-re-tc4: Clicking add button should navigate to add page', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('+ Add New Recipe'));
    fireEvent.click(screen.getByText('+ Add New Recipe'));
    expect(mockNavigate).toHaveBeenCalledWith('/add');
  });

  test('rp-bb-re-tc5: Private recipes show correct label', async () => {
    renderComponent();
    await waitFor(() => {
      const privateItem = screen.getByText('My Secret Recipe').closest('li');
      expect(privateItem).toHaveTextContent('(Private)');
    });
  });

  test('rp-bb-re-tc6: Public recipes do not show private label', async () => {
    renderComponent();
    await waitFor(() => {
      const publicItem = screen.getByText('Public Dish').closest('li');
      expect(publicItem).not.toHaveTextContent('(Private)');
    });
  });
});
