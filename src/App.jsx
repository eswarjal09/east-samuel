import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { FoodProvider } from './context/FoodContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { HealthProvider } from './context/HealthContext';
import { DateProvider } from './context/DateContext';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Exercise from './pages/Exercise';
import Health from './pages/Health';

function App() {
  return (
    <DateProvider>
      <FoodProvider>
        <ExerciseProvider>
          <HealthProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/food" element={<Food />} />
                  <Route path="/exercise" element={<Exercise />} />
                  <Route path="/health" element={<Health />} />
                </Routes>
              </Layout>
            </Router>
          </HealthProvider>
        </ExerciseProvider>
      </FoodProvider>
    </DateProvider>
  );
}

export default App;
