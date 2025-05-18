import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './page/RecipeList';
import RecipeDetail from './page/RecipeDetail';
import RecipeForm from './page/RecipeForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/edit/:id" element={<RecipeForm />} />
        <Route path="/add" element={<RecipeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
