import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutScreen = () => {
  const navigate = useNavigate();
  const [workoutType, setWorkoutType] = useState('Cardio');
  const [duration, setDuration] = useState('30 Mins');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [activityLevel, setActivityLevel] = useState('Moderate');

  const handleBack = () => {
    navigate('/goals');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Workout plan submitted:', { workoutType, duration, age, gender, activityLevel });
    navigate('/progress');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <h1>Your Workout Plan</h1>
      </div>
      
      <form className="workout-form" onSubmit={handleSubmit}>
        <div className="form-field workout-type">
          <div className="workout-type-label">
            {workoutType}
          </div>
        </div>
        
        <div className="form-field duration-field">
          <div className="duration-label">
            Duration, {duration}
          </div>
        </div>
        
        <div className="form-field">
          <div className="age-field">
            <label>AGE</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="age-input"
              placeholder="Enter your age"
              required
            />
          </div>
        </div>
        
        <div className="form-field">
          <label>Gender</label>
          <div className="dropdown-select">
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="form-dropdown"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="dropdown-arrow">▶</div>
          </div>
        </div>
        
        <div className="form-field">
          <label>Activity Level</label>
          <div className="dropdown-select">
            <select 
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="form-dropdown"
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
              <option value="Very Active">Very Active</option>
            </select>
            <div className="dropdown-arrow">▶</div>
          </div>
        </div>
        
        <button type="submit" className="submit-button">Submit Goal</button>
      </form>
    </div>
  );
};

export default WorkoutScreen;