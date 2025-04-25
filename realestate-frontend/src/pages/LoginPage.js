import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InputField = ({ label, type, name, value, onChange, error }) => (
  <div className="relative z-0 w-full mb-6 group">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 ${
        error ? 'border-red-500' : 'border-gray-600'
      } appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400 peer`}
      placeholder=" "
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/agents/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('Login successful:', response.data);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md p-8 bg-[#1a1a1a] rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome Back</h2>
        {apiError && <p className="text-red-400 text-sm text-center mb-4">{apiError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;