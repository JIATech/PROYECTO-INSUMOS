// src/services/axios.service.js
import router from '@/router';
import axios from 'axios';

// Configurar Axios aquí
axios.defaults.baseURL = 'http://localhost:3000/api/v1/';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configurar interceptores si es necesario
axios.interceptors.request.use(config => {
  // Aquí puede añadir lógica antes de enviar una solicitud, como agregar un token de autenticación
  const token = localStorage.getItem('user-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => response, error => {
  // Aquí puede manejar errores globalmente, como redirigir en caso de errores de autenticación
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('user-token');
    // Redirigir al usuario al inicio de sesión
    router.push('/login'); // Asegúrese de importar y usar Vue Router si es necesario
  }
  return Promise.reject(error);
});

export default axios;
