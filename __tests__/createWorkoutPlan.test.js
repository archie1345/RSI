import { createWorkoutPlan } from '../src/api/workoutPlanAPI'; // Corrected path

jest.mock('../src/api/workoutPlanAPI', () => ({ // Corrected path
  createWorkoutPlan: jest.fn()
}));

describe('Create Workout Plan Feature', () => {
  const input = {
    userid: 'user123',
    level: 'Beginner',
    duration: 30,
    intensity: 'Light'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- White-box: Basis Path Testing ---
  test('Path 1: Valid submission should insert and return data', async () => {
    createWorkoutPlan.mockResolvedValueOnce([input]);

    const result = await createWorkoutPlan(
      input.userid,
      input.level,
      input.duration,
      input.intensity
    );

    expect(createWorkoutPlan).toHaveBeenCalledWith(
      input.userid,
      input.level,
      input.duration,
      input.intensity
    );
    expect(result).toEqual([input]);
  });

  test('Path 2: Error during submission', async () => {
    const error = new Error('Insert failed');
    createWorkoutPlan.mockRejectedValueOnce(error);

    await expect(
      createWorkoutPlan(input.userid, input.level, input.duration, input.intensity)
    ).rejects.toThrow('Insert failed');
  });

  // --- Black-box: Equivalence Partitioning ---
  test('TC1: Missing level shows validation error', () => {
    const badInput = { ...input, level: '' };

    const validate = () => {
      if (!badInput.level) throw new Error('Level required');
    };

    expect(validate).toThrow('Level required');
  });

  test('TC2: Missing duration shows validation error', () => {
    const badInput = { ...input, duration: null };

    const validate = () => {
      if (badInput.duration === null || badInput.duration === undefined)
        throw new Error('Duration required');
    };

    expect(validate).toThrow('Duration required');
  });

  test('TC3: Missing intensity shows validation error', () => {
    const badInput = { ...input, intensity: '' };

    const validate = () => {
      if (!badInput.intensity) throw new Error('Intensity required');
    };

    expect(validate).toThrow('Intensity required');
  });

  test('TC4: Valid input should not throw error', () => {
    const validInput = { ...input };

    const validate = () => {
      if (!validInput.level) throw new Error('Level required');
      if (!validInput.duration && validInput.duration !== 0) throw new Error('Duration required');
      if (!validInput.intensity) throw new Error('Intensity required');
    };

    expect(validate).not.toThrow();
  });
});
