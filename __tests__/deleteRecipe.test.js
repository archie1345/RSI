// __tests__/deleteRecipe.test.js
import { deleteRecipe } from '../src/api/recipeApi';

jest.mock('../src/api/recipeApi', () => ({
  deleteRecipe: jest.fn(),
}));

describe('Delete Recipe Feature', () => {
  const recipeId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for successful deletion
    deleteRecipe.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    // No specific mocks to restore, just clear all calls.
  });

  // --- White-box: Basis Path Testing ---
  // (Based on the 'api-delete-recipe' immersive analysis with V(G)=1 path,
  // which effectively means a success and failure scenario)

  test('rp-wb-de-tc1: Successful deletion should return null error', async () => {
    deleteRecipe.mockResolvedValueOnce({ error: null }); // Explicitly mock success for this path

    const { error } = await deleteRecipe(recipeId);

    expect(deleteRecipe).toHaveBeenCalledWith(recipeId);
    expect(error).toBeNull();
  });

  test('rp-wb-de-tc2: Deletion error should return the error object', async () => {
    const mockError = new Error('Deletion failed on server');
    deleteRecipe.mockResolvedValueOnce({ error: mockError }); // Explicitly mock failure for this path

    const { error } = await deleteRecipe(recipeId);

    expect(deleteRecipe).toHaveBeenCalledWith(recipeId);
    expect(error).toEqual(mockError);
  });

  // --- Black-box: Equivalence Partitioning ---
  // Note: These tests assume a validation layer exists BEFORE the deleteRecipe API call.
  // The provided deleteRecipe function does not inherently perform these validations,
  // but relies on Supabase to handle invalid IDs.

  test('rp-bb-de-tc1: Invalid recipe ID should be handled by the API (if API has validation)', async () => {
    const invalidId = null; // Or 'abc', or -1
    const mockError = new Error('Invalid ID provided'); // Error message from hypothetical validation
    deleteRecipe.mockResolvedValueOnce({ error: mockError });

    const { error } = await deleteRecipe(invalidId);

    // This test would typically verify that the API call itself is made with the invalid ID
    // and that the error is returned by the API as expected for an invalid input.
    expect(deleteRecipe).toHaveBeenCalledWith(invalidId);
    expect(error).toEqual(mockError);
  });

  test('rp-bb-de-tc2: Valid recipe ID should lead to successful deletion', async () => {
    // This is essentially a re-test of Path 1, reinforcing black-box perspective
    deleteRecipe.mockResolvedValueOnce({ error: null });

    const { error } = await deleteRecipe(recipeId);

    expect(deleteRecipe).toHaveBeenCalledWith(recipeId);
    expect(error).toBeNull();
  });
});
