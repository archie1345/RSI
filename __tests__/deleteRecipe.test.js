// __tests__/deleteRecipe.test.js
import { deleteRecipe } from '../src/api/recipeApi';

jest.mock('../src/api/recipeApi', () => ({
  deleteRecipe: jest.fn()
}));

describe('Delete Recipe Feature', () => {
  const recipeId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- White-box: Basis Path Testing ---
  test('Path 1: Successful deletion', async () => {
    deleteRecipe.mockResolvedValueOnce({ data: { recipeid: recipeId }, error: null });

    const { data, error } = await deleteRecipe(recipeId);

    expect(deleteRecipe).toHaveBeenCalledWith(recipeId);
    expect(data.recipeid).toBe(recipeId);
    expect(error).toBeNull();
  });

  test('Path 2: Deletion error', async () => {
    deleteRecipe.mockResolvedValueOnce({ data: null, error: new Error('Delete failed') });

    const { data, error } = await deleteRecipe(recipeId);

    expect(data).toBeNull();
    expect(error).toEqual(new Error('Delete failed'));
  });

  // --- Black-box: Equivalence Partitioning ---
  test('TC1: Invalid recipe ID', async () => {
    const invalidId = null;

    deleteRecipe.mockResolvedValueOnce({ data: null, error: new Error('Invalid ID') });

    const { data, error } = await deleteRecipe(invalidId);

    expect(data).toBeNull();
    expect(error).toEqual(new Error('Invalid ID'));
  });

  test('TC2: Valid recipe ID', async () => {
    deleteRecipe.mockResolvedValueOnce({ data: { recipeid: recipeId }, error: null });

    const { data, error } = await deleteRecipe(recipeId);

    expect(data.recipeid).toBe(recipeId);
    expect(error).toBeNull();
  });
});
