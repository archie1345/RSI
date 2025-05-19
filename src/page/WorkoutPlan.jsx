// src/pages/WorkoutPlan.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function WorkoutPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function fetchPlans() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('WorkoutPlan')
        .select('*')
        .eq('userId', user.id);

      if (error) {
        console.error(error);
      } else {
        setPlans(data);
      }
    }

    fetchPlans();
  }, []);

  return (
    <div>
      <h1>Your Workout Plans</h1>
      {plans.map(plan => (
        <div key={plan.workoutId}>
          <h3>{plan.level} - {plan.intensity}</h3>
          <p>Duration: {plan.duration} mins</p>
        </div>
      ))}
    </div>
  );
}

export default WorkoutPlan;
