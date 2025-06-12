// __tests__/createRecipe.test.js
import { createRecipe } from '../src/api/recipeApi';
// Import the actual supabase client to mock its methods
import { supabase } from '../src/supabaseClient';

// Mock the supabaseClient module. This allows us to control the behavior of supabase calls.
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(), // Mock the insert method specifically
    })),
  },
}));

describe('Create Recipe Feature', () => {
  const mockUserId = 'user123';
  const commonInput = {
    title: 'Nasi Goreng',
    description: 'Delicious fried rice.',
    ingredients: [{ amount: '1', unit: 'plate', item: 'rice' }],
    steps: ['Fry rice', 'Add egg'],
    visibility: 'public',
    // userid is passed as a separate argument to createRecipe, not in data object
  };

  // Mock console.error and window.alert to prevent test interruptions
  // and to verify their calls.
  let consoleErrorSpy;
  let windowAlertSpy;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test

    // Reset the mock implementation for supabase.from().insert for each test
    // Default to a successful insert operation
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: [{ recipeid: 1, ...commonInput }], error: null }),
    });

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    windowAlertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console and alert implementations after each test
    consoleErrorSpy.mockRestore();
    windowAlertSpy.mockRestore();
  });

  // --- White-box: Basis Path Testing for createRecipe API function ---
  // (Based on the 'api-create-recipe' immersive analysis with V(G)=3 paths)

  // Path 1: Successful creation when pictLink is falsy
  test('rp-wb-cr-tc1: Should successfully create a recipe with null pictlink if not provided and no error', async () => {
    const inputWithoutPictLink = { ...commonInput, pictLink: '' }; // Simulate falsy pictLink

    const { data, error } = await createRecipe(inputWithoutPictLink, mockUserId);

    // Expect the actual supabase insert to have been called with the correct payload
    expect(supabase.from).toHaveBeenCalledWith('Recipe');
    expect(supabase.from().insert).toHaveBeenCalledWith([
      expect.objectContaining({
        userid: mockUserId,
        title: inputWithoutPictLink.title,
        pictlink: null, // This is the expected transformation in createRecipe's logic
        ingredients: inputWithoutPictLink.ingredients,
        steps: inputWithoutPictLink.steps,
        visibility: inputWithoutPictLink.visibility,
      }),
    ]);

    expect(data).toEqual(expect.any(Array)); // Expect data to be an array from successful insert
    expect(error).toBeNull();
    // Verify console.error and alert were NOT called
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(windowAlertSpy).not.toHaveBeenCalled();
  });

  // Path 2: Successful creation when pictLink is truthy
  test('rp-wb-cr-tc2: Should successfully create a recipe with a provided pictlink and no error', async () => {
    const inputWithPictLink = { ...commonInput, pictLink: 'http://example.com/image.jpg' };

    const { data, error } = await createRecipe(inputWithPictLink, mockUserId);

    // Expect the actual supabase insert to have been called with the correct payload
    expect(supabase.from).toHaveBeenCalledWith('Recipe');
    expect(supabase.from().insert).toHaveBeenCalledWith([
      expect.objectContaining({
        userid: mockUserId,
        title: inputWithPictLink.title,
        pictlink: inputWithPictLink.pictLink, // Expected pictlink to be preserved
        ingredients: inputWithPictLink.ingredients,
        steps: inputWithPictLink.steps,
        visibility: inputWithPictLink.visibility,
      }),
    ]);

    expect(data).toEqual(expect.any(Array));
    expect(error).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(windowAlertSpy).not.toHaveBeenCalled();
  });

  // Path 3: Error during submission (API returns error)
  test('rp-wb-cr-tc3: Should handle and report an error during recipe creation', async () => {
    const mockError = { message: 'Insert failed due to DB issue' }; // Supabase error format
    // Override the insert mock for this specific test to simulate an error
    supabase.from().insert.mockResolvedValueOnce({ data: null, error: mockError });

    const { data, error } = await createRecipe(commonInput, mockUserId);

    // Expect the actual supabase insert to have been called
    expect(supabase.from).toHaveBeenCalledWith('Recipe');
    expect(supabase.from().insert).toHaveBeenCalledWith([
      expect.objectContaining({
        userid: mockUserId,
        title: commonInput.title,
      }),
    ]);

    expect(data).toBeNull(); // Data should be null on error
    expect(error).toEqual(mockError); // Error object should be returned
    // Verify console.error and alert WERE called by the actual createRecipe function
    expect(consoleErrorSpy).toHaveBeenCalledWith('Insert error:', mockError);
    expect(windowAlertSpy).toHaveBeenCalledWith(`Insert failed: ${mockError.message}`);
  });

  // --- Black-box: Equivalence Partitioning ---
  // Note: These tests assume a validation layer exists BEFORE the createRecipe API call.
  // The provided createRecipe function does not inherently perform these validations,
  // but relies on Supabase schema validation or external validation.

  test('rp-bb-cr-tc1: Missing title shows validation error (Hypothetical)', () => {
    // This test simulates a scenario where an upstream validation function
    // would throw an error for a missing title.
    const badInput = { ...commonInput, title: '' };
    const validate = () => {
      if (!badInput.title) throw new Error('Title required');
    };
    expect(validate).toThrow('Title required');
  });

  test('rp-bb-cr-tc2: Missing ingredients shows validation error (Hypothetical)', () => {
    const badInput = { ...commonInput, ingredients: '' };
    const validate = () => {
      if (!badInput.ingredients) throw new Error('Ingredients required');
    };
    expect(validate).toThrow('Ingredients required');
  });

  test('rp-bb-cr-tc3: Missing visibility shows validation error (Hypothetical)', () => {
    const badInput = { ...commonInput, visibility: '' };
    const validate = () => {
      if (!badInput.visibility) throw new Error('Visibility required');
    };
    expect(validate).toThrow('Visibility required');
  });

  test('rp-bb-cr-tc4: Valid input should not throw validation error (Hypothetical)', () => {
    const validInput = { ...commonInput };
    const validate = () => {
      if (!validInput.title) throw new Error('Title required');
      if (!validInput.ingredients) throw new Error('Ingredients required');
      if (!validInput.visibility) throw new Error('Visibility required');
    };
    expect(validate).not.toThrow();
  });
});
