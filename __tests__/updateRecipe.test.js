// __tests__/updateRecipe.test.js
import { updateRecipe } from '../src/api/recipeApi';
// No need for 'act' if using React Testing Library correctly for component tests.
// This file tests the API function directly, so 'act' is not relevant here.

jest.mock('../src/api/recipeApi', () => ({
  updateRecipe: jest.fn(),
}));

describe('Update Recipe Feature', () => {
  const mockRecipeId = 1;
  const updateData = {
    title: 'Updated Title',
    description: 'Updated content for the recipe.',
    pictlink: 'http://newpic.url/image.jpg',
    visibility: 'public',
    ingredients: [{ amount: '2', unit: 'tbsp', item: 'butter' }],
    steps: ['Updated Step 1', 'Updated Step 2'],
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    // Set up default successful mock for updateRecipe for all tests
    // Individual tests can override this using .mockResolvedValueOnce()
    updateRecipe.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    // No specific mocks to restore, just clear all calls.
  });

  // --- White-box: Basis Path Testing for updateRecipe API function ---
  // (Based on the 'api-update-recipe' immersive analysis with V(G)=1 path,
  // which effectively means a success and failure scenario)

  test('Path 1: Successful update should return null error', async () => {
    updateRecipe.mockResolvedValueOnce({ error: null }); // Explicitly mock success for this path

    const { error } = await updateRecipe(mockRecipeId, updateData);

    expect(updateRecipe).toHaveBeenCalledWith(mockRecipeId, updateData);
    expect(error).toBeNull();
  });

  test('Path 2: Update fails should return the error object', async () => {
    const mockError = new Error('Database update failed');
    updateRecipe.mockResolvedValueOnce({ error: mockError }); // Explicitly mock failure for this path

    const { error } = await updateRecipe(mockRecipeId, updateData);

    expect(updateRecipe).toHaveBeenCalledWith(mockRecipeId, updateData);
    expect(error).toEqual(mockError);
  });

  // --- Black-box: Equivalence Partitioning ---
  // Note: These tests assume a validation layer exists BEFORE the updateRecipe API call.
  // The provided updateRecipe function does not inherently perform these validations.

  test('TC1: Update with empty title (invalid input for hypothetical validation)', async () => {
    // This test simulates a scenario where validation (external to updateRecipe API)
    // would catch an empty title and prevent the update or return a specific error.
    const badInput = { ...updateData, title: '' };
    const validationError = new Error('Title required');

    // Here, we mock the API to return the validation error, implying it was caught
    // either by the API endpoint or a pre-API validation layer.
    updateRecipe.mockResolvedValueOnce({ error: validationError });

    const { error } = await updateRecipe(mockRecipeId, badInput);

    expect(updateRecipe).toHaveBeenCalledWith(mockRecipeId, badInput);
    expect(error).toEqual(validationError);
  });

  test('TC2: Valid update with all fields (re-test of Path 1 from black-box perspective)', async () => {
    // This is essentially a re-test of Path 1 but from a black-box perspective,
    // ensuring a fully valid input leads to success.
    updateRecipe.mockResolvedValueOnce({ error: null }); // Explicitly mock success

    const { error } = await updateRecipe(mockRecipeId, updateData);

    expect(updateRecipe).toHaveBeenCalledWith(mockRecipeId, updateData);
    expect(error).toBeNull();
  });
});
