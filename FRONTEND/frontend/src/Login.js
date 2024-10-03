import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const onChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', loginData);
      console.log(res.data);
      // Handle successful login (e.g., redirect or store token)
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <input type="text" name="username" placeholder="Username" onChange={onChange} />
        </div>
        <div className="form-row">
          <input type="password" name="password" placeholder="Password" onChange={onChange} />
        </div>
        <button type="submit">Login</button>
        <div>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
