import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://remotehub-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

interface UserData {
  email: string;
  password: string;
  name?: string;
  company?: string;
  role?: string;
}

interface JobFilters {
  search?: string;
  page?: number;
  jobType?: string[];
  experienceLevel?: string[];
  category?: string[];
  location?: string;
  tags?: string[];
  limit?: number;
}

interface JobHistoryData {
  jobId: string;
  status: string;
  appliedDate: Date;
  notes?: string;
}

export const login = (email: string, password: string) =>
  api.post("/auth/signin", { email, password });

export const signup = (userData: UserData) =>
  api.post("/auth/signup", userData);

export const logout = () => api.get("/auth/signout");

export const getCurrentUser = () => api.get("/auth/me");

export const getJobs = (params: JobFilters) => api.get("/jobs", { params });

export const getJob = (id: string) => api.get(`/jobs/${id}`);

export const getUserJobHistory = () => api.get("/user/jobhistory");

export const addJobToHistory = (jobData: JobHistoryData) =>
  api.post("/users/jobhistory", jobData);

export const getCompanies = () => api.get("/companies");

export const getCompany = (id: string) => api.get(`/companies/${id}`);

export const googleLogin = (token: string) =>
  api.post("/auth/google", { token });

export const githubLogin = (code: string) => api.post("/auth/github", { code });

export default api;
