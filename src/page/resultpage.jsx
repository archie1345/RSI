import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { calorieApi } from '../api/calorieAPI'; // ✅ Tambahkan ini
import './Caloriecalc.css';

function ResultPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestResult = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('You must be logged in.');
        navigate('/login');
        return;
      }

      try {
        const result = await calorieApi.getLatestResult(user.id); // ✅ Gunakan calorieApi
        setData(result);
        setLoading(false);
      } catch (error) {
        alert("No data found or something went wrong.");
        console.error(error);
        navigate('/calorie-form');
      }
    };

    fetchLatestResult();
  }, [navigate]);

  if (loading || !data) return <div className="container">Loading...</div>;

  const goalDesc = {
    maintenance: "For maintaining current weight",
    bulking: "For weight gain (+500 Kkal)",
    cutting: "For weight loss (-500 Kkal)"
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h1>Your Daily Nutrition</h1>

      <div className="main-result">
        <h2>Daily Calories</h2>
        <p>{data.calories} Kkal</p>
        <p className="description">{goalDesc[data.goal]}</p>
      </div>

      <div className="macros-container">
        <div className="macro-card">
          <h4>Protein</h4>
          <p>{data.protein}g</p>
        </div>
        <div className="macro-card">
          <h4>Carbs</h4>
          <p>{data.carbs}g</p>
        </div>
        <div className="macro-card">
          <h4>Fat</h4>
          <p>{data.fat}g</p>
        </div>
      </div>

      <div className="continue-container">
        <button className="continue-btn" onClick={() => navigate('/calorie-form')}>Continue</button>
      </div>
    </div>
  );
}

export default ResultPage;
