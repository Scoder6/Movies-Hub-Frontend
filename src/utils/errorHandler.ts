export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'Request failed';
  } else if (error.request) {
    // Request was made but no response
    return 'Network error - please check your connection';
  } else {
    // Other errors
    return 'An unexpected error occurred';
  }
};
