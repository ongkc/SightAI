import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignaturePage from './SignaturePage';

function App() {
  return (
<Router>
  <Routes>
    <Route path="/" element={<Navigate replace to="/login" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signature" element={<SignaturePage />} />
  </Routes>
</Router>
  )}
export default App;