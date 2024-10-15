import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = (email: string, password: string) =>
  api.post("/auth/signin", { email, password });

export const signup = (userData: any) => api.post("/auth/signup", userData);

export const logout = () => api.get("/auth/signout");

export const getCurrentUser = () => api.get("/auth/me");

export const getJobs = (params: any) => api.get("/jobs", { params });

export const getJob = (id: string) => api.get(`/jobs/${id}`);

export const getUserJobHistory = () => api.get("/user/jobhistory");

export const addJobToHistory = (jobData: any) =>
  api.post("/users/jobhistory", jobData);

export const getCompanies = () => api.get("/companies");

export const getCompany = (id: string) => api.get(`/companies/${id}`);

export const googleLogin = (token: string) =>
  api.post("/auth/google", { token });

export const githubLogin = (code: string) => api.post("/auth/github", { code });

export default api;

// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// export const login = (email: string, password: string) =>
//   api.post("/auth/signin", { email, password });

// export const signup = (userData: any) => api.post("/auth/signup", userData);

// export const logout = () => api.get("/auth/signout");

// export const getCurrentUser = () => api.get("/auth/me");

// export const getJobs = (params: any) => api.get("/jobs", { params });

// export const getJob = (id: string) => api.get(`/jobs/${id}`);

// export const getUserJobHistory = () => api.get("/users/jobhistory");

// export const addJobToHistory = (jobData: any) =>
//   api.post("/users/jobhistory", jobData);

// export default api;
