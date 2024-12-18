import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ErrorResponse {
  message: string;
  [key: string]: any;
}

interface UserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
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

// Custom error handling
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || "An error occurred";
      const status = error.response.status;

      // Handle authentication errors
      if (status === 401) {
        // Redirect to login page if not authenticated
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      throw new ApiError(status, message, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      throw new ApiError(503, "Network error - no response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new ApiError(500, error.message || "Request configuration error");
    }
  }
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/signin", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData: UserData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/auth/signout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Jobs endpoints
export const getJobs = async (params: JobFilters) => {
  try {
    const response = await api.get("/jobs", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJob = async (id: string) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User job history endpoints
export const getUserJobHistory = async () => {
  try {
    const response = await api.post("/users/jobhistory");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addJobToHistory = async (jobData: JobHistoryData) => {
  try {
    const response = await api.post("/users/jobhistory", jobData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Company endpoints
export const getCompanies = async () => {
  try {
    const response = await api.get("/companies");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompany = async (id: string) => {
  try {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// OAuth endpoints
export const googleLogin = async (token: string) => {
  try {
    const response = await api.post("/auth/google", { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const githubLogin = async (code: string) => {
  try {
    const response = await api.post("/auth/github", { code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User profile endpoints
export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<UserData>) => {
  try {
    const response = await api.put("/users/profile/update", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
