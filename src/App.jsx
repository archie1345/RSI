import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import RecipeList from './page/RecipeList';
import RecipeDetail from './page/RecipeDetail';
import RecipeForm from './page/RecipeForm';
import LoginForm from './page/LoginForm';
import RegisterForm from './page/RegisterForm';
import CustomizeWorkout from './page/CustomizeWorkout';
import WorkoutPlan from './page/WorkoutPlan';
import Notes from './page/notes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);  // Also set loading false here
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/"
          element={user ? <HomePage user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={user ? <RecipeList user={user}/> : <Navigate to="/login" replace />} />
        <Route
          path="/recipe/:id"
          element={user ? <RecipeDetail user={user}/> : <Navigate to="/login" replace />} />
        <Route
          path="/edit/:id"
          element={user ? <RecipeForm user={user}/> : <Navigate to="/login" replace />} />
        <Route
          path="/add"
          element={user ? <RecipeForm user={user}/> : <Navigate to="/login" replace />} />
        <Route
          path="/CustomizeWorkout"
          element={<CustomizeWorkout />} />
        <Route
          path="/WorkoutPlan"
          element={<WorkoutPlan />} />
        <Route
          path="/Notes"
          element={<Notes />} />
      </Routes>
    </Router>
  );
}

export default App;
