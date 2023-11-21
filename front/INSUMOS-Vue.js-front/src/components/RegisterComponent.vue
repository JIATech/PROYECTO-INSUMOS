
<template>
  <div class="register-container">
    <form @submit.prevent="registerUser" class="register-form">
      <input type="text" v-model="user.usuario" placeholder="Nombre de usuario" class="input-field" />
      <input type="email" v-model="user.email" placeholder="Correo electrónico" class="input-field" />
      <input type="password" v-model="user.password" placeholder="Contraseña" class="input-field" />
      <select v-model="user.rol" class="select-field">
        <option value="">Seleccionar Rol</option>
        <option value="2">Cliente</option>
        <option value="1">Administrador</option>
      </select>
      <button type="submit" class="submit-button">Registrar</button>
    </form>
    <div v-if="message.content" :class="{'message': true, 'success': message.type === 'success', 'error': message.type === 'error'}">
      {{ message.content }}
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import axios from '@/services/axios.service.js';
import { AxiosError } from 'axios';

type ServerResponse = {
  ok: boolean;
  message: string;
};

export default defineComponent({
  setup() {
    const user = reactive({
      usuario: '',
      email: '',
      password: '',
      rol: ''
    });

    const message = ref({ content: '', type: '' });

    const messageClass = computed(() => {
      return {
        'message': true,
        'success': message.value.type === 'success',
        'error': message.value.type === 'error'
      };
    });

    const registerUser = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/usuarios/crearUsuario', user);
        if (response.data.ok) {
          message.value = { content: 'Usuario cargado con éxito', type: 'success' };
        } else {
          message.value = { content: response.data.message || 'Error desconocido', type: 'error' };
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const serverError = error as AxiosError<ServerResponse>;
          if (serverError.response && serverError.response.data) {
            const responseData = serverError.response.data;
            message.value = { 
              content: responseData.message || 'Error desconocido',
              type: 'error' 
            };
          } else {
            message.value = { content: 'Error de conexión con el servidor', type: 'error' };
          }
        } else if (error instanceof Error) {
          message.value = { content: error.message, type: 'error' };
        } else {
          message.value = { content: 'Ocurrió un error inesperado', type: 'error' };
        }
      }
    };

    return { user, registerUser, message, messageClass };
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