import React, { useEffect, useState } from 'react';

function ResultPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('calorieResults');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      alert("No data found.");
      window.location.href = '/';
    }
  }, []);

  if (!data) return null;

  const goalDesc = {
    maintenance: "For maintaining current weight",
    bulking: "For weight gain (+500 Kkal)",
    cutting: "For weight loss (-500 Kkal)"
  };

  return (
    <div className="container">
      <h1>Your Daily Nutrition</h1>
      <div className="main-result">
        <h2>Daily Calories</h2>
        <p>{data.calories} Kkal</p>
        <p className="description">{goalDesc[data.goal]}</p>
      </div>
      <div className="macros-container">
        <div className="macro-card"><h4>Protein</h4><p>{data.protein}g</p></div>
        <div className="macro-card"><h4>Carbs</h4><p>{data.carbs}g</p></div>
        <div className="macro-card"><h4>Fat</h4><p>{data.fat}g</p></div>
      </div>
    </div>
  );
}

export default ResultPage;
