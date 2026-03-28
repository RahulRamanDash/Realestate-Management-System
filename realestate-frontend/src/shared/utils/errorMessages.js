/**
 * Error message utilities - Provides specific error messages based on error type and context
 */

/**
 * Extract specific error message from API error response
 * @param {Error} error - The error object from API call
 * @param {string} defaultMessage - Default message if no specific error found
 * @returns {string} - Specific error message
 */
export const getErrorMessage = (error, defaultMessage = "Something went wrong") => {
  // API error response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Validation error
  if (error?.response?.data?.fieldErrors || error?.response?.data?.errors) {
    const errors = error.response.data.fieldErrors || error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors[0]?.message || defaultMessage;
    }
    if (typeof errors === 'object') {
      return Object.values(errors)[0] || defaultMessage;
    }
  }

  // Network error
  if (error?.message === 'Network Error') {
    return 'Network connection failed. Please check your internet connection.';
  }

  // Request timeout
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  // Status codes with specific messages
  if (error?.response?.status === 400) {
    return 'Invalid request. Please check your input.';
  }

  if (error?.response?.status === 401) {
    return 'Authentication failed. Please login again.';
  }

  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error?.response?.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error?.response?.status === 409) {
    return 'This resource already exists or conflicts with existing data.';
  }

  if (error?.response?.status === 422) {
    return 'Unable to process your request. Please check the information and try again.';
  }

  if (error?.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  if (error?.response?.status === 503) {
    return 'Service temporarily unavailable. Please try again later.';
  }

  return defaultMessage;
};

/**
 * Get specific error message for auth operations
 */
export const getAuthErrorMessage = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 400 && data?.message?.includes('exist')) {
    return 'This email is already registered. Please login or use a different email.';
  }

  if (status === 400 && data?.message?.includes('password')) {
    return 'Password does not meet requirements. Must be at least 8 characters.';
  }

  if (status === 401) {
    return 'Invalid email or password. Please try again.';
  }

  if (status === 409) {
    return 'This email is already registered. Please use the login page.';
  }

  return getErrorMessage(error, 'Authentication failed. Please try again.');
};

/**
 * Get specific error message for property operations
 */
export const getPropertyErrorMessage = (error, operation = 'operation') => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 400) {
    if (data?.message?.includes('title')) {
      return 'Please provide a valid property title.';
    }
    if (data?.message?.includes('price')) {
      return 'Please provide a valid price.';
    }
    if (data?.message?.includes('address')) {
      return 'Please provide a valid address.';
    }
    return 'Invalid property information. Please check and try again.';
  }

  if (status === 404) {
    return 'This property no longer exists.';
  }

  if (status === 403) {
    return 'You do not have permission to modify this property.';
  }

  if (operation === 'fetch') {
    return 'Unable to load properties. Please try again later.';
  }

  if (operation === 'create') {
    return 'Failed to create property. Please try again.';
  }

  if (operation === 'update') {
    return 'Failed to update property. Please try again.';
  }

  if (operation === 'delete') {
    return 'Failed to delete property. Please try again.';
  }

  if (operation === 'purchase') {
    return 'Unable to purchase this property. Please try again.';
  }

  if (operation === 'image-upload') {
    return 'Failed to upload images. Please try again.';
  }

  return getErrorMessage(error, `Unable to ${operation} property. Please try again.`);
};

/**
 * Get specific error message for form operations
 */
export const getFormErrorMessage = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 400 && (data?.fieldErrors || data?.errors)) {
    // Return first validation error
    const errors = data.fieldErrors || data.errors;
    const firstError = Array.isArray(errors)
      ? errors[0]?.message
      : Object.values(errors)[0];
    return firstError || 'Please check your input and try again.';
  }

  if (status === 422) {
    return 'Some fields have invalid data. Please review and try again.';
  }

  return getErrorMessage(error, 'Unable to submit form. Please try again.');
};

/**
 * Extract field-specific validation errors
 * @param {Error} error - The error object
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const getFieldErrors = (error) => {
  const data = error?.response?.data;
  const fieldErrors = {};

  const errors = data?.fieldErrors || data?.errors;

  if (errors) {
    if (Array.isArray(errors)) {
      errors.forEach((err) => {
        if (err.field) {
          fieldErrors[err.field] = err.message;
        }
      });
    } else if (typeof errors === 'object') {
      Object.entries(errors).forEach(([field, message]) => {
        fieldErrors[field] = message;
      });
    }
  }

  return fieldErrors;
};

/**
 * Get error message for specific API endpoints
 */
export const getEndpointErrorMessage = (error, endpoint = '') => {
  const operation = endpoint.split('/').pop();

  if (endpoint.includes('properties')) {
    return getPropertyErrorMessage(error, operation);
  }

  if (endpoint.includes('auth') || endpoint.includes('login') || endpoint.includes('register')) {
    return getAuthErrorMessage(error);
  }

  return getErrorMessage(error);
};
