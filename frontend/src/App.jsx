import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DTODetail from './components/DTODetail';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>LandRe - Asset Integrity & Revenue Risk</h1>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/opinion/:id" element={<DTODetail />} />
      </Routes>
    </div>
  );
}

export default App;
