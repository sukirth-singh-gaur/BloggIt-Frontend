import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/apiService';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', role: 'author' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 md:border-1 border-0 md:border-gray-100 rounded-lg md:shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Get started with Bloggit!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" className=" text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" onChange={handleChange} required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" className=" text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" onChange={handleChange} required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" className=" text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" onChange={handleChange} required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" className=" text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" onChange={handleChange} required />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 ">Register</button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="font-medium text-grey-800 hover:text-black-900 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;