// __tests__/updateRecipe.test.js
import { updateRecipe } from '../src/api/recipeApi';
import { act } from 'react-dom/test-utils';

jest.mock('../src/api/recipeApi', () => ({
  updateRecipe: jest.fn()
}));

describe('Update Recipe Feature', () => {
  const mockRecipe = {
    recipeid: 1,
    title: 'Original',
    content: 'Old content',
    visibility: 'private'
  };

  const updatedData = {
    title: 'Updated Title',
    content: 'Updated content',
    visibility: 'public'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- White-box: Basis Path Testing ---
  test('Path 1: Successful update', async () => {
    updateRecipe.mockResolvedValueOnce({ data: { ...mockRecipe, ...updatedData }, error: null });

    const result = await updateRecipe(mockRecipe.recipeid, updatedData);

    expect(updateRecipe).toHaveBeenCalledWith(mockRecipe.recipeid, updatedData);
    expect(result.data.title).toBe('Updated Title');
    expect(result.error).toBeNull();
  });

  test('Path 2: Update fails', async () => {
    updateRecipe.mockResolvedValueOnce({ data: null, error: new Error('Update error') });

    const result = await updateRecipe(mockRecipe.recipeid, updatedData);

    expect(updateRecipe).toHaveBeenCalledWith(mockRecipe.recipeid, updatedData);
    expect(result.data).toBeNull();
    expect(result.error).toEqual(new Error('Update error'));
  });

  // --- Black-box: Equivalence Partitioning ---
  test('TC1: Update with empty title (invalid)', async () => {
    updateRecipe.mockResolvedValueOnce({ data: null, error: new Error('Title required') });

    const result = await updateRecipe(mockRecipe.recipeid, { ...updatedData, title: '' });

    expect(result.data).toBeNull();
    expect(result.error).toEqual(new Error('Title required'));
  });

  test('TC2: Valid update with all fields', async () => {
    updateRecipe.mockResolvedValueOnce({ data: { ...mockRecipe, ...updatedData }, error: null });

    const result = await updateRecipe(mockRecipe.recipeid, updatedData);

    expect(result.data.title).toBe('Updated Title');
    expect(result.error).toBeNull();
  });
});
