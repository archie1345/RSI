document.addEventListener('DOMContentLoaded', function() {
    const results = JSON.parse(localStorage.getItem('calorieResults'));
    if (results) {
        document.getElementById('calories').textContent = `${results.calories} Kkal`;
        document.getElementById('protein').textContent = `${results.protein}g`;
        document.getElementById('carbs').textContent = `${results.carbs}g`;
        document.getElementById('fat').textContent = `${results.fat}g`;
        
        // Set goal description
        const goalDesc = {
            'maintenance': 'For maintaining current weight',
            'bulking': 'For weight gain (+500 Kkal)',
            'cutting': 'For weight loss (-500 Kkal)'
        };
        document.getElementById('goal-description').textContent = goalDesc[results.goal];
    } else {
        alert('No results found. Please calculate again.');
        window.location.href = 'Caloriecalc.html';
    }
});