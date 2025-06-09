// src/components/BackButton.jsx (or wherever you keep your reusable components)
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ className = '', style = {} }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This navigates to the previous entry in the history stack
  };

  return (
    <button
      onClick={handleGoBack}
      className={`back-button ${className}`} // Add a default class and allow custom ones
      style={{
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        border: 'none',
        backgroundColor: '#e0e0e0', // Light grey background
        color: '#333', // Dark text
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...style // Allow inline style overrides
      }}
    >
      {/* You can use an arrow icon or just text */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      Back
    </button>
  );
};

export default BackButton;
