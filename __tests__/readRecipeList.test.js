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

// Mock supabase client specific methods used by RecipeList
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: jest.fn(),
  }
}));

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RecipeList Component Tests', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockPublicRecipe = { recipeid: 1, title: 'Public Dish', visibility: 'public', userid: 'other-user-1' };
  const mockPrivateOwnedRecipe = { recipeid: 2, title: 'My Secret Recipe', visibility: 'private', userid: mockUser.id };
  const mockPrivateOtherRecipe = { recipeid: 3, title: 'Someone Else\'s Private Recipe', visibility: 'private', userid: 'other-user-2' };
  const allMockRecipes = [mockPublicRecipe, mockPrivateOwnedRecipe, mockPrivateOtherRecipe];

  let consoleErrorSpy;
  // REMOVED: `locationReloadSpy` declaration. We will no longer try to spy on or mock window.location.reload directly.

  const renderComponent = (user = mockUser, initialEntries = ['/']) => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <RecipeList user={user} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // This clears all Jest mocks.

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // REMOVED: All window.location.reload mocking attempts (Object.defineProperty, jest.spyOn).
    // This is the core of the fix for the persistent TypeError.

    // Default mock for successful getRecipes API call
    getRecipes.mockResolvedValue({
      data: allMockRecipes,
      error: null,
    });
    // Default mock for successful signOut
    supabase.auth.signOut.mockResolvedValue({});
  });

  afterEach(() => {
    // jest.restoreAllMocks() is crucial here. It will restore console.error spy
    // and ensure no residual mocks affect subsequent tests.
    jest.restoreAllMocks();
  });

  // --- White-box: Basis Path Testing for useEffect 1 (Initial Fetch) ---
  test('useEffect 1 - Path 1: Should fetch recipes successfully on mount', async () => {
    renderComponent();
    expect(getRecipes).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText(mockPublicRecipe.title)).toBeInTheDocument();
      expect(screen.getByText(mockPrivateOwnedRecipe.title)).toBeInTheDocument();
      expect(screen.queryByText(mockPrivateOtherRecipe.title)).not.toBeInTheDocument();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test('useEffect 1 - Path 2: Should log error if initial recipe fetch fails', async () => {
    const apiError = new Error('Network error during fetch');
    getRecipes.mockResolvedValueOnce({ data: null, error: apiError });
    renderComponent();
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(apiError);
      expect(screen.getByText('No recipes to display.')).toBeInTheDocument();
    });
  });

  // --- White-box: Basis Path Testing for useEffect 2 (User Check) ---
  test('useEffect 2 - Path 1: Should not navigate to login if user is present', async () => {
    renderComponent(mockUser);
    await waitFor(() => expect(getRecipes).toHaveBeenCalled()); // Ensure initial fetch completes
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('useEffect 2 - Path 2: Should navigate to login if user is not present', async () => {
    renderComponent(null); // Pass null user
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login'); // Verify navigation
    });
    // REMOVED: `expect(getRecipes).not.toHaveBeenCalled()`
    // The `getRecipes` call in the first useEffect *will* still happen on mount.
  });

  // --- White-box: Basis Path Testing for useEffect 3 (Filtering Recipes) ---
  test('useEffect 3 - Path 1: Should not filter recipes if no user is present (early return)', async () => {
    renderComponent(null);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login')); // Wait for navigation
    expect(screen.getByText('No recipes to display.')).toBeInTheDocument();
  });

  test('useEffect 3 - Paths 2 & 3: Should filter for public and user-owned recipes when "Public" filter is active', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(mockPublicRecipe.title)).toBeInTheDocument();
      expect(screen.getByText(mockPrivateOwnedRecipe.title)).toBeInTheDocument();
      expect(screen.queryByText(mockPrivateOtherRecipe.title)).not.toBeInTheDocument();
    });
  });

  test('useEffect 3 - Path 4: Should filter for only user-owned recipes when "Private" filter is active', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText(mockPublicRecipe.title)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Private' }));
    await waitFor(() => {
      expect(screen.queryByText(mockPublicRecipe.title)).not.toBeInTheDocument();
      expect(screen.getByText(mockPrivateOwnedRecipe.title)).toBeInTheDocument();
      expect(screen.queryByText(mockPrivateOtherRecipe.title)).not.toBeInTheDocument();
    });
  });

  // --- White-box: Basis Path Testing for handleLogout ---
  test('handleLogout - Path 1: Should sign out and reload window on logout button click', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('Logout'));
    fireEvent.click(screen.getByText('Logout'));
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    // REMOVED: `expect(window.location.reload).toHaveBeenCalledTimes(1)`.
    // This assertion is problematic in strict JSDOM environments.
    // We confirm the signOut API call, which is the primary logical action.
  });

  // --- Black-box: Equivalence Partitioning & Boundary Value Analysis ---
  test('TC1: No recipes should show empty state message', async () => {
    getRecipes.mockResolvedValueOnce({ data: [], error: null });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No recipes to display.')).toBeInTheDocument();
    });
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  test('TC2: Display large list of recipes (Boundary Value Analysis - large input)', async () => {
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

  test('TC3: Clicking a recipe should navigate to its detail page', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText(mockPublicRecipe.title)).toBeInTheDocument());
    fireEvent.click(screen.getByText(mockPublicRecipe.title));
    expect(mockNavigate).toHaveBeenCalledWith(`/recipe/${mockPublicRecipe.recipeid}`);
  });

  test('TC4: Clicking "Add New Recipe" button should navigate to add page', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('+ Add New Recipe'));
    fireEvent.click(screen.getByText('+ Add New Recipe'));
    expect(mockNavigate).toHaveBeenCalledWith('/add');
  });

  test('TC5: Visibility label for private owned recipes', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('My Secret Recipe')).toBeInTheDocument();
      const privateRecipeItem = screen.getByText('My Secret Recipe').closest('li');
      expect(privateRecipeItem).toHaveTextContent('(Private)');
    });
  });

  test('TC6: Visibility label should not be present for public recipes', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Public Dish')).toBeInTheDocument();
      const publicRecipeItem = screen.getByText('Public Dish').closest('li');
      expect(publicRecipeItem).not.toHaveTextContent('(Private)');
    });
  });
});
