import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Helper to set Clerk token
let getClerkToken = null;

export const setClerkTokenGetter = (getter) => {
  getClerkToken = getter;
};

// Request interceptor to add Clerk token
api.interceptors.request.use(async (config) => {
  if (getClerkToken) {
    const token = await getClerkToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ---------- Auth Service ----------
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

export default api;
