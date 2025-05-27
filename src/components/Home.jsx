import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="page-container">
      <div className="welcome-header">
        <h1>Welcome, User</h1>
      </div>

      <div className="nav-buttons-container">
        <button 
          className="nav-button"
          onClick={() => handleNavigate('/goals')}
        >
          Fitness Goals
        </button>

        <button 
          className="nav-button"
          onClick={() => handleNavigate('/workout')}
        >
          Workout Recommendation
        </button>
      </div>
    </div>
  );
};

export default Home;