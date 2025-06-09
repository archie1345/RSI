// src/page/HomePage.jsx
import { useNavigate } from 'react-router-dom';

function HomePage({ user }) {
  const navigate = useNavigate();

  const username = user?.user_metadata?.username;
  const fallback = user?.email || 'Guest';

  const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.reload();
    };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome, {username || fallback}!</h1>
      <p>Select a feature to get started:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <button onClick={() => navigate('/add')}>Add Recipe</button>
        <button onClick={() => navigate('/displayRecipe')}>View Recipes</button>
        <button onClick={() => navigate('/CustomizeWorkout')}>Customize Workout</button>
        <button onClick={() => navigate('/WorkoutPlan')}>View Workout Plan</button>
        <button className="nav-button" onClick={() => handleNavigate('/goals')}>Fitness Goals</button>
        <button className="nav-button" onClick={() => handleNavigate('/workout')}>Workout Recommendation</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}


export default HomePage;
