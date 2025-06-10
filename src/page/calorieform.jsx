import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Caloriecalc.css';

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

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { weight, height, age, sex, activity, goal } = form;
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseInt(age);
  const act = parseFloat(activity);

  let bmr = sex === 'male'
    ? (10 * w) + (6.25 * h) - (5 * a) + 5
    : (10 * w) + (6.25 * h) - (5 * a) - 161;

  const tdee = bmr * act;
  const calories = goal === 'bulking' ? tdee + 500 :
                   goal === 'cutting' ? tdee - 500 : tdee;

  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.4) / 4);
  const fat = Math.round((calories * 0.3) / 9);

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in.");
      navigate('/login');
      return;
    }

    const { error: insertError } = await supabase.from('calorie_results').insert([{
      userid: user.id,
      weight: w,
      height: h,
      age: a,
      sex,
      activity_level: act,
      goal,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein,
      carbs,
      fat
    }]);

    if (insertError) {
      console.error("Insert error:", insertError);
      alert("Failed to save result.");
      return;
    }

    navigate('/calorie-result');
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h1>Calorie Calculator</h1>
      <p className="subtitle">We'd like to personalize your body needs. Let us know how you identify:</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="weight">Weight (Kg):</label>
          <input type="number" id="weight" placeholder="Enter your weight" min="0" step="0.1" value={form.weight} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height (Cm):</label>
          <input type="number" id="height" placeholder="Enter your height" min="0" value={form.height} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" placeholder="Enter your age" min="0" value={form.age} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <select id="sex" value={form.sex} onChange={handleChange} required>
            <option value="" disabled>Select your sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="activity">Activity Level:</label>
          <select id="activity" value={form.activity} onChange={handleChange} required>
            <option value="" disabled>Select activity level</option>
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
            <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
            <option value="1.9">Extra active (very hard exercise & physical job)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Goals:</label>
          <select id="goal" value={form.goal} onChange={handleChange} required>
            <option value="" disabled>Select your goal</option>
            <option value="maintenance">Maintenance</option>
            <option value="bulking">Bulking</option>
            <option value="cutting">Cutting</option>
          </select>
        </div>

        <button type="submit" className="calculate-btn">Calculate</button>
      </form>
    </div>
  );
}

export default CalorieForm;
