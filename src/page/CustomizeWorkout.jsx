import { useState } from 'react';
import { createWorkoutPlan } from '../api/workoutPlanAPI'; // Or inline the function
import { supabase } from '../supabaseClient';

function CustomizeWorkout() {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('Light');

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('You must be logged in.');
      return;
    }

    try {
      await createWorkoutPlan(user.id, level, duration, intensity);
      alert('Workout plan saved!');
      window.location.href = '/WorkoutPlan'; // Adjust to your route
    } catch (e) {
      alert('Error saving workout plan.');
    }
  };

  return (
    <div className="container">
      {step === 0 && (
        <div>
          <h2>Get Started</h2>
          <p>Let's build your workout plan!</p>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Select Level</h2>
          {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
            <button key={lvl} onClick={() => setLevel(lvl)} className={level === lvl ? 'active' : ''}>
              {lvl}
            </button>
          ))}
          <button onClick={nextStep} disabled={!level}>Continue</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Duration</h2>
          <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
            {[5,10,15,20,30,45,60,75,90,120].map(min => (
              <option key={min} value={min}>{min} minutes</option>
            ))}
          </select>
          <button onClick={nextStep}>Continue</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Intensity</h2>
          <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Heavy">Heavy</option>
          </select>
          <button onClick={nextStep}>Continue</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Done!</h2>
          <button onClick={handleSubmit}>Finish Setup</button>
        </div>
      )}

      {step > 0 && <button onClick={prevStep}>← Back</button>}
    </div>
  );
}

export default CustomizeWorkout;