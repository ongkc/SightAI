import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./login-page-container.css"

function LoginPage({ onLogin}) {
  const API = 'http://13.67.71.103:10989'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`${API}/signin`, { username, password,
     headers: {
      "X-Requested-With": "XMLHttpRequest", 
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-type, Origin, X-Requested-With'
    } })
    .then((response) => {
        const token = response.data.token
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        onLogin();
        Cookies.set('token', token, { expires }); // set token as a cookie
        navigate('/signature');
      })
      .catch((error) => {
        // Handle login error here, e.g. show error message
        if (error.response.status === 401) {
          setLoginError('Login failed. Please check your username and password and try again.');
        }

        if (error.response.status === 500){
          setServerError('Login failed. Server error please try again later')
        }
        console.error(error);
      });
  };

  return (
    <div className='login-page-container'>
      <div>
        <h2>Login Page</h2>
          {loginError && <div className="error">{loginError}</div>}
          {serverError && <div className="error">{serverError}</div>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit">Login</button>
          </form>
      </div>
    </div>
  );
}

export default LoginPage;