/**
 * axios setup
 */

import axios from 'axios'

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT
})

// Add an interceptor for requests
axiosServices.interceptors.request.use((config) => {
  // token stored in localStorage
  // const token = localStorage.getItem('accessToken');

  const token = import.meta.env.VITE_API_TOKEN

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Add an interceptor for responses
axiosServices.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
)

export default axiosServices
