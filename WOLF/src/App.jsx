
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Workout from './WorkoutTimer.jsx';
import FitnessHome from './FitnessHome.jsx';
import Apifetch from './api.jsx';
import Auth from './auth.jsx';
import ProfileSetup from "./ProfileSetup.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<FitnessHome />} />
      <Route path="/ai" element={<Apifetch />} />
      <Route path="/workout" element={<Workout />} />
      <Route path="/auth" element={<Auth />} />
<Route path="/profile-setup" element={<ProfileSetup />} />
    </Routes>
  );
}

export default App;
