// src/page/HomePage.jsx
import { useNavigate } from 'react-router-dom';

function HomePage({ user }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome, {user?.email || 'Guest'}!</h1>
      <p>Select a feature to get started:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <button onClick={() => navigate('/add')}>Add Recipe</button>
        <button onClick={() => navigate('/')}>View Recipes</button>
        <button onClick={() => navigate('/CustomizeWorkout')}>Customize Workout</button>
        <button onClick={() => navigate('/WorkoutPlan')}>View Workout Plan</button>
      </div>
    </div>
  );
}

export default HomePage;