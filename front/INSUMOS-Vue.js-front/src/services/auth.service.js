// src/services/auth.service.js
import axios from 'axios';

let tokenRefreshInterval;

export function getToken() {
  return localStorage.getItem('user-token');
}

export function setToken(token) {
  localStorage.setItem('user-token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  startTokenRefreshInterval();
}

export function removeToken() {
  localStorage.removeItem('user-token');
  delete axios.defaults.headers.common['Authorization'];
  clearTokenRefreshInterval();
}

function startTokenRefreshInterval() {
  tokenRefreshInterval = setInterval(refreshToken, 25 * 60 * 1000); // refresca el token cada 25 minutos
}

function clearTokenRefreshInterval() {
  clearInterval(tokenRefreshInterval);
}

async function refreshToken() {
  const currentToken = getToken();
  if (currentToken) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/refreshToken', { token: currentToken });
      if (response.data && response.data.newToken) {
        setToken(response.data.newToken);
      } else {
        // Manejar la situación en que no se pudo renovar el token
        handleTokenRenewalFailure();
      }
    } catch (error) {
      // Manejar errores aquí, como un error en la solicitud de renovación
      handleTokenRenewalFailure();
    }
  }
}

function handleTokenRenewalFailure() {
  removeToken();
  // Redirigir al usuario al inicio de sesión o mostrar un mensaje de error
  // Puede utilizar un enrutador de Vue o una notificación global, dependiendo de su implementación
  window.location = '/login'; // Ejemplo simple de redirección
}
