import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Router and Routes
import axios from 'axios';
import './App.css';
import Login from './Login'; // Import the Login component

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    lastName: '',
    emailAddress: '',
    username: '',
    accountNumber: '',
    idNumber: '',
    password: '',
    confirmPassword: ''
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <div className="form-container">
            <h1>Customer Registration Form</h1>
            <form onSubmit={onSubmit}>
              <div className="form-row">
                <input type="text" name="fullName" placeholder="First Name" onChange={onChange} />
                <input type="text" name="lastName" placeholder="Last Name" onChange={onChange} />
              </div>
              <div className="form-row">
                <input type="text" name="emailAddress" placeholder="Email Address" onChange={onChange} />
                <input type="text" name="username" placeholder="Username" onChange={onChange} />
              </div>
              <div className="form-row">
                <input type="password" name="password" placeholder="Password" onChange={onChange} />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={onChange} />
              </div>
              <div className="form-row">
                <input type="text" name="accountNumber" placeholder="Account Number" onChange={onChange} />
                <input type="text" name="idNumber" placeholder="ID Number" onChange={onChange} />
              </div>
              <button type="submit">Submit</button>
              <div>
                <Link to="/login">Click to Login</Link>
              </div>
            </form>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
