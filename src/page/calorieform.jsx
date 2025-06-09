import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CalorieForm() {
  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
    sex: '',
    activity: '',
    goal: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { weight, height, age, sex, activity, goal } = form;
    const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age), act = parseFloat(activity);

    let bmr = sex === 'male'
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const tdee = bmr * act;
    let calories = goal === 'bulking' ? tdee + 500 :
                   goal === 'cutting' ? tdee - 500 : tdee;

    const protein = Math.round((calories * 0.3) / 4);
    const carbs = Math.round((calories * 0.4) / 4);
    const fat = Math.round((calories * 0.3) / 9);

    localStorage.setItem('calorieResults', JSON.stringify({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein, carbs, fat, goal
    }));

    navigate('/result');
  };

  return (
    <div className="container">
      <h1>Calorie Calculator</h1>
      <form onSubmit={handleSubmit}>
        {<input
  type="number"
  id="weight"
  placeholder="Enter your weight"
  value={form.weight}
  onChange={handleChange}
  required
/>}
        <input type="number" id="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required />
        <input type="number" id="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} required />
        <input type="number" id="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <select id="sex" value={form.sex} onChange={handleChange} required>
          <option value="">Select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select id="activity" value={form.activity} onChange={handleChange} required>
          <option value="">Select activity level</option>
          <option value="1.2">Sedentary</option>
          <option value="1.375">Lightly active</option>
          <option value="1.55">Moderately active</option>
          <option value="1.725">Very active</option>
          <option value="1.9">Extra active</option>
        </select>
        <select id="goal" value={form.goal} onChange={handleChange} required>
          <option value="">Select goal</option>
          <option value="maintenance">Maintenance</option>
          <option value="bulking">Bulking</option>
          <option value="cutting">Cutting</option>
        </select>
        <button type="submit" className="calculate-btn">Calculate</button>
      </form>
    </div>
  );
}

export default CalorieForm;
import { supabase } from '../api/supabaseClient';