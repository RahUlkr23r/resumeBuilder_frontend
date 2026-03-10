import { apiClient, endpoints } from './api';

export const checkTime = async () => {
  try {
    const response = await apiClient.get(endpoints.checkTime);
    return response.data;
  } catch (error) {
    console.error('Error checking time:', error);
    // Default to not expired if can't check
    return { expired: false, remainingMinutes: 20 };
  }
};

export const formatTimeRemaining = (minutes) => {
  if (minutes < 1) return 'Less than 1 minute';
  if (minutes === 1) return '1 minute';
  return `${minutes} minutes`;
};