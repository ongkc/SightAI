import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignaturePage from './SignaturePage';
import Cookies  from 'js-cookie';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      console.log(token)
      setLoggedIn(true);
    }
  }, []);

  function handleLogin() {
    setLoggedIn(true);
  }

  const handleLogout = () => {
    setLoggedIn(false);
  };
  console.log(loggedIn)
  return (
<Router>
  <Routes>
    <Route path="/" element={<Navigate replace to="/login" />} />
    <Route path="/login" element={loggedIn ? <Navigate replace to="/signature" /> :<LoginPage onLogin={handleLogin} Page />} />
    <Route path="/signature" element={loggedIn ? (<SignaturePage onLogout={handleLogout}/>) : (<Navigate replace to="/login" />)}/>  </Routes>
</Router>
  )}
export default App;