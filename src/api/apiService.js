import axios from 'axios';

const API_URL = '/api'; // Proxy handles the full URL

// Auth Service
export const register = (userData) => axios.post(`${API_URL}/users/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/users/login`, userData);
export const logout = () => axios.post(`${API_URL}/users/logout`);
export const getProfile = () => axios.get(`${API_URL}/users/profile`);

// Blog Service
export const createBlog = (blogData) => axios.post(`${API_URL}/blogs`, blogData);
export const getAllBlogs = () => axios.get(`${API_URL}/blogs`);
export const getBlogById = (id) => axios.get(`${API_URL}/blogs/${id}`);
export const updateBlog = (id, blogData) => axios.put(`${API_URL}/blogs/${id}`, blogData);
export const deleteBlog = (id) => axios.delete(`${API_URL}/blogs/${id}`);

// Comment Service
export const createComment = (blogId, commentData) => axios.post(`${API_URL}/blogs/${blogId}/comments`, commentData);
export const getCommentsForBlog = (blogId) => axios.get(`${API_URL}/blogs/${blogId}/comments`);

//Image Upload Service
export const uploadImage = (formData) => {
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};