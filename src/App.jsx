import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import RecipeList from './page/RecipeList';
import RecipeDetail from './page/RecipeDetail';
import RecipeForm from './page/RecipeForm';
import LoginForm from './page/LoginForm';
import RegisterForm from './page/RegisterForm';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const getCurrentSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  getCurrentSession(); // fetch session on first load

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/"
          element={user ? <RecipeList /> : <Navigate to="/login" replace />} />
        <Route
          path="/recipe/:id"
          element={user ? <RecipeDetail /> : <Navigate to="/login" replace />} />
        <Route
          path="/edit/:id"
          element={user ? <RecipeForm /> : <Navigate to="/login" replace />} />
        <Route
          path="/add"
          element={user ? <RecipeForm /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
