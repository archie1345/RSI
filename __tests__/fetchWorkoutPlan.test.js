import { fetchWorkoutPlans } from '../workoutPlanAPI';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => {
  const eqMock = jest.fn();
  const selectMock = jest.fn(() => ({ eq: eqMock }));

  return {
    supabase: {
      from: jest.fn(() => ({ select: selectMock })),
      selectMock,
      eqMock,
    },
  };
});

describe('fetchWorkoutPlans', () => {
  const mockData = [{ id: 1, level: 'Beginner' }];
  const eqMock = supabase.eq;
  const selectMock = supabase.from().select;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return plans when userId is provided', async () => {
    eqMock.mockResolvedValueOnce({ data: mockData, error: null });

    const response = await fetchWorkoutPlans('user123');

    expect(supabase.from).toHaveBeenCalledWith('WorkoutPlan');
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith('userid', 'user123');
    expect(response.data).toEqual(mockData);
    expect(response.error).toBeNull();
  });

  it('should return empty data and no error if userId is empty string', async () => {
    const response = await fetchWorkoutPlans('');
    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should return empty data and no error if userId is null', async () => {
    const response = await fetchWorkoutPlans(null);
    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should handle Supabase errors gracefully', async () => {
    const mockError = new Error('DB error');
    eqMock.mockResolvedValueOnce({ data: null, error: mockError });

    const response = await fetchWorkoutPlans('user123');

    expect(response.data).toBeNull();
    expect(response.error).toEqual(mockError);
  });

  it('should return empty data if no plans exist for the user', async () => {
    eqMock.mockResolvedValueOnce({ data: [], error: null });

    const response = await fetchWorkoutPlans('user123');

    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
  });

  it('should not call supabase methods if userId is undefined', async () => {
    const response = await fetchWorkoutPlans(undefined);
    expect(response.data).toEqual([]);
    expect(response.error).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
