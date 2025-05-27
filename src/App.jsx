import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import GoalsScreen from './components/GoalsScreen';
import WorkoutScreen from './components/WorkoutScreen';
import ProgressScreen from './components/ProgressScreen';

function App() {
  return (
    <Router>
      <div className="app-container fitness-app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<GoalsScreen />} />
          <Route path="/workout" element={<WorkoutScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;