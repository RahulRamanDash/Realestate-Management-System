import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from "lucide-react";

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

const UserAuth = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") === "register" ? false : true;

  const [isLogin, setIsLogin] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setIsLogin(tab === 'login');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
    setErrors({});
    setApiError('');
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone must be exactly 10 digits';
      }
      if (!formData.role) newErrors.role = 'Role is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
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
      if (isLogin) {
        // Login API
        const response = await axios.post('http://localhost:8080/api/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('loggedUser', JSON.stringify(response.data));
        console.log('Login successful:', response.data);
        navigate('/dashboard'); // Change route according to your app
      } else {
        // Register API
        await axios.post('http://localhost:8080/api/register', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        });
        console.log('Registration successful');
        setIsLogin(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: '',
        });
        setErrors({});
        setApiError('');
        setSuccessMessage('Registration successful! Please login.');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => handleTabChange('login')}
            className={`w-1/2 py-3 text-md font-semibold transition ${
              isLogin ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`w-1/2 py-3 text-md font-semibold transition ${
              !isLogin ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-4">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {/* API Error */}
        {apiError && <p className="text-red-400 text-sm text-center mb-4">{apiError}</p>}

        {/* Success Message */}
        {successMessage && <p className="text-emerald-400 text-sm text-center mb-4">{successMessage}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <InputField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <InputField
                label="Phone number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              {/* Role select */}
              <div className="relative z-0 w-full mb-6 group">
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`block w-full text-sm text-white bg-gray-700 border border-gray-600 rounded-md px-2 py-2 focus:outline-none focus:border-emerald-400`}
                >
                  <option value="">Select Role</option>
                  <option value="agent">Agent</option>
                  <option value="buyer">Buyer</option>
                </select>
                {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
              </div>
            </>
          )}

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
          {!isLogin && (
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-300"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAuth;