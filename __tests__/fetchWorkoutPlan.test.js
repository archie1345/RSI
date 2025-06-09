import { fetchWorkoutPlans } from '../src/api/workoutPlanAPI';
import { supabase } from '../src/supabaseClient';

jest.mock('../src/supabaseClient', () => {
  // Define all nested mocks here, ensuring they are fresh for each test.
  // This structure ensures that `from`, `select`, `eq` are always Jest mock functions
  // that can be spied upon.
  const eqMock = jest.fn();
  const selectMock = jest.fn(() => ({ eq: eqMock }));
  const fromMock = jest.fn(() => ({ select: selectMock }));

  return {
    supabase: {
      from: fromMock,
      // Expose the internal mocks directly so we can set their return values easily.
      // This is generally better than trying to access them via `supabase.from().select()`.
      _eqMock: eqMock,
      _selectMock: selectMock,
      _fromMock: fromMock,
    },
  };
});

describe('fetchWorkoutPlans', () => {
  const mockData = [{ id: 1, level: 'Beginner' }];
  
  // Directly reference the exposed internal mocks from the jest.mock factory
  const mockSupabaseFrom = supabase._fromMock;
  const mockSupabaseSelect = supabase._selectMock;
  const mockSupabaseEq = supabase._eqMock;

  beforeEach(() => {
    // Clear all mock calls and reset their implementations to default
    jest.clearAllMocks();

    // Set the default successful mock for the eq method before each test.
    // This can be overridden by specific tests later using `.mockResolvedValueOnce()`.
    mockSupabaseEq.mockResolvedValue({ data: mockData, error: null });
  });

  it('should return plans when userId is provided', async () => {
    const response = await fetchWorkoutPlans('user123');

    // Assert that the Supabase methods were called as expected
    expect(mockSupabaseFrom).toHaveBeenCalledWith('WorkoutPlan');
    expect(mockSupabaseSelect).toHaveBeenCalled();
    expect(mockSupabaseEq).toHaveBeenCalledWith('userid', 'user123');
    
    expect(response.data).toEqual(mockData);
    expect(response.error).toBeNull();
  });

  it('should return empty data and no error if userId is empty string', async () => {
    const response = await fetchWorkoutPlans('');
    
    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    // Crucial: Expect Supabase methods NOT to be called because of the early exit condition
    expect(mockSupabaseFrom).not.toHaveBeenCalled();
    expect(mockSupabaseSelect).not.toHaveBeenCalled();
    expect(mockSupabaseEq).not.toHaveBeenCalled();
  });

  it('should return empty data and no error if userId is null', async () => {
    const response = await fetchWorkoutPlans(null);
    
    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    // Crucial: Expect Supabase methods NOT to be called
    expect(mockSupabaseFrom).not.toHaveBeenCalled();
    expect(mockSupabaseSelect).not.toHaveBeenCalled();
    expect(mockSupabaseEq).not.toHaveBeenCalled();
  });

  it('should handle Supabase errors gracefully', async () => {
    const mockError = new Error('DB error');
    // Override the default successful mock for this specific test case
    mockSupabaseEq.mockResolvedValueOnce({ data: null, error: mockError });

    const response = await fetchWorkoutPlans('user123');

    expect(response.data).toBeNull();
    expect(response.error).toEqual(mockError);
    // Ensure Supabase methods WERE called even if there's an error
    expect(mockSupabaseFrom).toHaveBeenCalledWith('WorkoutPlan');
    expect(mockSupabaseSelect).toHaveBeenCalled();
    expect(mockSupabaseEq).toHaveBeenCalledWith('userid', 'user123');
  });

  it('should return empty data if no plans exist for the user', async () => {
    // Override the default successful mock for this specific test case
    mockSupabaseEq.mockResolvedValueOnce({ data: [], error: null });

    const response = await fetchWorkoutPlans('user123');

    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    // Ensure Supabase methods WERE called
    expect(mockSupabaseFrom).toHaveBeenCalledWith('WorkoutPlan');
    expect(mockSupabaseSelect).toHaveBeenCalled();
    expect(mockSupabaseEq).toHaveBeenCalledWith('userid', 'user123');
  });

  it('should not call supabase methods if userId is undefined', async () => {
    const response = await fetchWorkoutPlans(undefined);
    
    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    // Crucial: Expect Supabase methods NOT to be called
    expect(mockSupabaseFrom).not.toHaveBeenCalled();
    expect(mockSupabaseSelect).not.toHaveBeenCalled();
    expect(mockSupabaseEq).not.toHaveBeenCalled();
  });
});
