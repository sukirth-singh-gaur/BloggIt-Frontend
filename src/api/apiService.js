import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ---------- Auth Service ----------
export const register = (userData) =>
  api.post("/api/users/register", userData);

export const login = (userData) =>
  api.post("/api/users/login", userData);

export const logout = () =>
  api.post("/api/users/logout");

export const getProfile = () =>
  api.get("/api/users/profile");

// ---------- Blog Service ----------
export const createBlog = (blogData) =>
  api.post("/api/blogs", blogData);

export const getAllBlogs = () =>
  api.get("/api/blogs");

export const getBlogById = (id) =>
  api.get(`/api/blogs/${id}`);

export const updateBlog = (id, blogData) =>
  api.put(`/api/blogs/${id}`, blogData);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`);

// ---------- Comment Service ----------
export const createComment = (blogId, commentData) =>
  api.post(`/api/blogs/${blogId}/comments`, commentData);

export const getCommentsForBlog = (blogId) =>
  api.get(`/api/blogs/${blogId}/comments`);

// ---------- Grammar Check ----------
export const grammarCheck = async (text) => {
  const { data } = await api.post("/api/grammar-check", { text });
  return data;
};

// ---------- Image Upload ----------
export const uploadImage = (formData) =>
  api.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
