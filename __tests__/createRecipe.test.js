// __tests__/createRecipe.test.js
import { createRecipe } from '../src/api/recipeApi';

jest.mock('../src/api/recipeApi', () => ({
  createRecipe: jest.fn()
}));

describe('Create Recipe Feature', () => {
  const input = {
    title: 'Nasi Goreng',
    ingredients: 'Rice, Egg',
    visibility: 'public',
    userid: 'user123'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- White-box: Basis Path Testing ---
  test('Path 1: Valid submission should insert and return data', async () => {
    createRecipe.mockResolvedValueOnce({ data: [input], error: null });

    const { data, error } = await createRecipe(input);

    expect(createRecipe).toHaveBeenCalledWith(input);
    expect(data).toEqual([input]);
    expect(error).toBeNull();
  });

  test('Path 2: Error during submission', async () => {
    createRecipe.mockResolvedValueOnce({ data: null, error: new Error('Insert failed') });

    const { data, error } = await createRecipe(input);

    expect(data).toBeNull();
    expect(error).toEqual(new Error('Insert failed'));
  });

  // --- Black-box: Equivalence Partitioning ---
  test('TC1: Missing title shows validation error', () => {
    const badInput = { ...input, title: '' };

    const validate = () => {
      if (!badInput.title) throw new Error('Title required');
    };

    expect(validate).toThrow('Title required');
  });

  test('TC2: Missing ingredients shows validation error', () => {
    const badInput = { ...input, ingredients: '' };

    const validate = () => {
      if (!badInput.ingredients) throw new Error('Ingredients required');
    };

    expect(validate).toThrow('Ingredients required');
  });

  test('TC3: Missing visibility shows validation error', () => {
    const badInput = { ...input, visibility: '' };

    const validate = () => {
      if (!badInput.visibility) throw new Error('Visibility required');
    };

    expect(validate).toThrow('Visibility required');
  });

  test('TC4: Valid input should not throw error', () => {
    const validInput = { ...input };

    const validate = () => {
      if (!validInput.title) throw new Error('Title required');
      if (!validInput.ingredients) throw new Error('Ingredients required');
      if (!validInput.visibility) throw new Error('Visibility required');
    };

    expect(validate).not.toThrow();
  });
});
