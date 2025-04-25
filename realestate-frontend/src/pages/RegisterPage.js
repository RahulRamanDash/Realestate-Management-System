import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../components/InputField';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
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
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone Number must be exactly 10 digits';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await axios.post('http://localhost:8080/api/agents/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md p-8 bg-[#1a1a1a] rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create an Agent Account</h2>
        {apiError && <p className="text-red-400 text-sm text-center mb-4">{apiError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="Phone number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import InputField from '../components/InputField';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' });
//     setApiError('');
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = 'Name is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.phone) {
//       newErrors.phone = 'Phone Number is required';
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = 'Phone Number must be exactly 10 digits';
//     }
//     if (!formData.password) newErrors.password = 'Password is required';
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8080/api/agents/register', {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//       });

//       console.log('Registration successful:', response.data);
//       navigate('/login');
//     } catch (error) {
//       setApiError(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-100 px-4">
//       <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Agent Account</h2>
//         {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <InputField
//             label="Name"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             error={errors.name}
//           />
//           <InputField
//             label="Email address"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             error={errors.email}
//           />
//           <InputField
//             label="Phone number"
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             error={errors.phone}
//           />
//           <InputField
//             label="Password"
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             error={errors.password}
//           />
//           <InputField
//             label="Confirm Password"
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             error={errors.confirmPassword}
//           />
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
//           >
//             Register
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-600 hover:underline font-medium">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;