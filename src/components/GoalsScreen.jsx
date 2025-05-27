import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoalsScreen = () => {
  const navigate = useNavigate();
  const [goalType, setGoalType] = useState('Loose Weight');
  const [targetWeight, setTargetWeight] = useState('60');
  const [duration, setDuration] = useState('8');

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Goal submitted:', { goalType, targetWeight, duration });
    navigate('/workout');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <h1>Set Your Fitness Goals</h1>
      </div>
      
      <form className="goals-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Choose Goals Type</label>
          <div className="dropdown-select">
            <select 
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="form-dropdown"
            >
              <option value="Loose Weight">Loose Weight</option>
              <option value="Gain Muscle">Gain Muscle</option>
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Improve Fitness">Improve Fitness</option>
            </select>
            <div className="dropdown-arrow">▶</div>
          </div>
        </div>
        
        <div className="form-group">
          <label>Target Weight</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="input-field"
            />
            <span className="unit-label">KG</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Duration</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field"
            />
            <span className="unit-label">Weeks</span>
          </div>
        </div>
        
        <button type="submit" className="submit-button">Submit Goal</button>
      </form>
    </div>
  );
};

export default GoalsScreen;