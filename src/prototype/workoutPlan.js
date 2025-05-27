// Mock workout data
const workouts = [
  {
    name: "Push-Ups",
    image: "Images/pushup1.jpg"
  },
  {
    name: "Squats",
    image: "Images/pushup1.jpg"
  },
  {
    name: "Jumping Jacks",
    image: "Images/pushup1.jpg"
  },
  {
    name: "Plank",
    image: "Images/pushup1.jpg"
  }
];

// Function to render workouts
function renderWorkouts() {
  const workoutList = document.getElementById("workout-list");
  workoutList.innerHTML = ""; // Clear existing

  workouts.forEach(workout => {
    const card = document.createElement("div");
    card.className = "workout-card";

    const img = document.createElement("img");
    img.src = workout.image;
    img.alt = workout.name;

    const info = document.createElement("div");
    info.className = "workout-info";
    info.textContent = workout.name;

    card.appendChild(img);
    card.appendChild(info);
    workoutList.appendChild(card);
  });
}

// Call function on page load
window.onload = renderWorkouts;
