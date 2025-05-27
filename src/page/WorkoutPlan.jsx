import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { fetchWorkoutPlans } from '../api/workoutPlanAPI';

function WorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlans() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No user logged in');
        return;
      }

      const { data, error } = await fetchWorkoutPlans(user.id);
      if (error) {
        setError(error.message);
        setPlans([]);
      } else {
        setPlans(data || []);
      }
    }

    loadPlans();
  }, []);

  

  if (error) return <div>Error loading plans: {error}</div>;

  return (
    <div>
      <h1>Your Workout Plans</h1>
      {plans.length === 0 ? (
        <p>No workout plans found.</p>
      ) : (
        plans.map(plan => (
          <div key={plan.workoutid}>
            <h3>{plan.level} - {plan.intensity}</h3>
            <p>Duration: {plan.duration} mins</p>
          </div>
        ))
      )}
    </div>
  );
}

export default WorkoutPlan;