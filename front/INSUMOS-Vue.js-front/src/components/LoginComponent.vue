<template>
  <div class="login-container">
    <form @submit.prevent="loginUser" class="login-form">
      <input type="text" v-model="user.usuario" placeholder="Nombre de usuario o correo electrónico" class="input-field" />
      <input type="password" v-model="user.password" placeholder="Contraseña" class="input-field" />
      <button type="submit" class="submit-button">Iniciar sesión</button>
    </form>
    <div v-if="message.content" :class="messageClass">
      {{ message.content }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import axios from '@/services/axios.service.js';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

export default defineComponent({
  setup() {
    const user = reactive({
      usuario: '',
      email: '',
      password: ''
    });

    const message = ref({
      content: '',
      type: ''
    });

    const messageClass = computed(() => ({
      'message': true,
      'success': message.value.type === 'success',
      'error': message.value.type === 'error'
    }));

    const loginUser = async () => {
      try {
        // Directamente obtener el token de la respuesta
        const { data } = await axios.post('http://localhost:3000/api/v1/login', {
          usuario: user.usuario,
          email: user.usuario,
          password: user.password
        });

        if (data.token) {
          localStorage.setItem('user-token', data.token);
          message.value = { content: 'Inicio de sesión exitoso', type: 'success' };
          // Aquí puede incluir cualquier lógica adicional necesaria después del inicio de sesión
          // Configurar Axios con el token
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } else {
          // Manejar el caso en que la respuesta no incluya un token
          message.value = { content: 'Inicio de sesión fallido', type: 'error' };
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>; // asumiendo que ErrorResponse es su tipo esperado
          if (axiosError.response && axiosError.response.data) {
            const errorData = axiosError.response.data as ErrorResponse;
            message.value = { content: errorData.message || 'Error desconocido', type: 'error' };
          }
        }
    };

    return { user, loginUser, message, messageClass };
  }
});
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(60, 60, 60, 0.29);;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-field,
.select-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.input-field:focus,
.select-field:focus {
  border-color: #007bff;
  outline: none;
}

.submit-button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: #007bff;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  transition: all 0.5s ease-in-out;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

</style>
