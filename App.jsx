import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Workout from './workout.jsx';
import FitnessHome from './FitnessHome.jsx';
import Apifetch from './api.jsx';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<FitnessHome />} />       
        <Route path="/ai" element={<Apifetch />} />      
        <Route path="/workout" element={<Workout />} />
      </Routes>
  );
}
export default App;