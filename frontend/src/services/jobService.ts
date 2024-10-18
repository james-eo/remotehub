import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://remotehub-backend.onrender.com";

export interface Job {
  _id: string;
  sourceUrl: string;
  title: string;
  tags: string[];
  company: {
    name: string;
    logo: string;
  };
  location: string;
  description: {
    sections: Array<{
      type: "heading" | "paragraph" | "ul" | "ol";
      level?: number;
      content?: string;
      items?: string[];
    }>;
  };
  excerpt: string;

  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: string;
  experienceLevel: string;
  skills: string[];
  postedAt: string;
}

export interface JobsResponse {
  data: Job[];
  totalPages: number;
  currentPage: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  salary?: [number, number];
  // salaryMin?: number;
  // salaryMax?: number;
  experienceLevel?: string[];
  jobType?: string[];
  category?: string[];
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export const getJobs = async (filters: JobFilters): Promise<JobsResponse> => {
  const response = await axios.get(`${API_URL}/jobs`, { params: filters });
  return response.data;
};

export const getJob = async (id: string): Promise<Job> => {
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};

export const getJobSuggestions = async (query: string): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/jobs/suggestions`, {
    params: { query },
  });
  return response.data;
};

export const getUniqueValues = async (field: string): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/jobs/unique-values`, {
    params: { field },
  });
  return response.data;
};
