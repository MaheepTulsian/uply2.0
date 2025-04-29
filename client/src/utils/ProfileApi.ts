// client/src/utils/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import useAuthStore from '@/store/useAuthStore';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Creates a configured axios instance with authentication
 */
export const createApiClient = () => {
  const { user } = useAuthStore.getState();
  
  const config: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  // Add auth token if available
  if (user?.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${user.token}`,
    };
  }
  
  return axios.create(config);
};

/**
 * Get profile data for the current user
 */
export const fetchProfile = async (userId: string) => {
  try {
    const api = createApiClient();
    const response = await api.get(`/profile/${userId}/getprofile`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to fetch profile data' 
    };
  }
};

/**
 * Generic function to update profile section
 */
export const updateProfileSection = async (userId: string, endpoint: string, data: any) => {
  try {
    const api = createApiClient();
    const response = await api.post(`/profile/${userId}/${endpoint}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    return { 
      success: false, 
      error: error.response?.data?.detail || `Failed to update ${endpoint}` 
    };
  }
};

// Specific API functions for each profile section
export const updatePersonalInfo = async (userId: string, data: any) => 
  updateProfileSection(userId, 'personal_info', data);

export const updateAcademicInfo = async (userId: string, data: any) => 
  updateProfileSection(userId, 'academic_info', { academics: data });

export const updateProjects = async (userId: string, data: any) => 
  updateProfileSection(userId, 'project_info', { projects: data });

export const updateSkills = async (userId: string, data: any) => 
  updateProfileSection(userId, 'skill_info', { skills: data });

export const updateWorkExperience = async (userId: string, data: any) => 
  updateProfileSection(userId, 'workex_info', { work_experience: data });

export const updateCertifications = async (userId: string, data: any) => 
  updateProfileSection(userId, 'certification_info', { certifications: data });

export const updateAchievements = async (userId: string, data: any) => 
  updateProfileSection(userId, 'achievement_info', { achievements: data });

export const updatePublications = async (userId: string, data: any) => 
  updateProfileSection(userId, 'publication_info', { publications: data });

export const updateSocialLinks = async (userId: string, data: any) => 
  updateProfileSection(userId, 'socials', data);