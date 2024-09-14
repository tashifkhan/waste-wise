import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CameraPage from './pages/CameraPage';
import CapturedImage from './pages/CapturedImage';
import LandingPage from './pages/Landing'
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/CameraPage" element={<CameraPage />} />
        <Route path="/display-image" element={<CapturedImage />} />
      </Routes>
    </Router>
  );
}

export default App;
