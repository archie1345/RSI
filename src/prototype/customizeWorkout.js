let currentStep = 0;
const steps = document.querySelectorAll('.step');
let userData = {
  level: '',
  duration: 30,
  intensity: 'Medium'
};

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
  currentStep = index;
}

function nextStep() {
  if (currentStep === 1 && userData.level === '') {
    alert('Please select your level before continuing.');
    return;
  }
  if (currentStep < steps.length - 1) {
    showStep(currentStep + 1);
  }
}

function updateBackButton() {
  document.getElementById('back-button').style.display = currentStep === 0 ? 'none' : 'block';
}
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
  currentStep = index;
  updateBackButton();
}
// Call once at init
updateBackButton();

function previousStep() {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  }

function selectLevel(level) {
  userData.level = level;
  console.log('Selected level:', level);

  // Find all buttons in the current step
  const buttons = document.querySelectorAll('#step-level button');

  // Remove the 'active' class from all buttons
  buttons.forEach(button => {
    button.classList.remove('active');
  });

  // Add the 'active' class to the clicked button
  const selectedButton = Array.from(buttons).find(button => button.textContent === level);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }
}

function updateDuration() {
    const select = document.getElementById('duration-select');
    userData.duration = select.value;
    document.getElementById('duration-display').textContent = `${select.value} minutes`;
  }  

function finishSetup() {
  alert("Workout plan created successfully!");
  window.location.href = "workoutPlan.html";
}
// In the future: send this data to a backend/database

// Initialize
showStep(0);
updateDuration();
