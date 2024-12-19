// Register.js
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import axios from 'axios';

const Register = ({ onRegister, history }) => {
  const handleRegister = async (email, password, fullName) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        email,
        password,
        fullName,
      });
      localStorage.setItem('token', response.data.token);
      onRegister(response.data);
      history.push('/');
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  return (
    <div>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
