document.getElementById('calorieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        // Get form values
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const age = parseInt(document.getElementById('age').value);
        const sex = document.getElementById('sex').value;
        const activity = parseFloat(document.getElementById('activity').value);
        const goal = document.getElementById('goal').value;
        
        // Validate inputs
        if (isNaN(weight)) throw new Error('Please enter a valid weight');
        if (isNaN(height)) throw new Error('Please enter a valid height');
        if (isNaN(age)) throw new Error('Please enter a valid age');
        if (!sex) throw new Error('Please select your sex');
        if (!activity) throw new Error('Please select activity level');
        if (!goal) throw new Error('Please select your goal');
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (sex === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        // Calculate TDEE
        const tdee = bmr * activity;
        
        // Adjust calories based on goal
        let calories;
        if (goal === 'bulking') {
            calories = tdee + 500;
        } else if (goal === 'cutting') {
            calories = tdee - 500;
        } else {
            calories = tdee;
        }
        
        // Calculate macronutrients (30% protein, 40% carbs, 30% fat)
        const protein = Math.round((calories * 0.3) / 4);
        const carbs = Math.round((calories * 0.4) / 4);
        const fat = Math.round((calories * 0.3) / 9);
        
        // Store results
        localStorage.setItem('calorieResults', JSON.stringify({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            calories: Math.round(calories),
            protein,
            carbs,
            fat,
            goal
        }));
        
        // Redirect to results page
        window.location.href = 'Result.html';
    } catch (error) {
        alert(error.message);
    }
});