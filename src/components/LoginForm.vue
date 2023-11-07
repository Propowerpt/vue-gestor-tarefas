<script setup>

import axios from 'axios'
import { ref, watch, onMounted } from 'vue'
const inputEmail = ref('');
const inputPassword = ref('');
const tokenDoLocalStorage = ref('');
// Para recuperar o token posteriormente
//const tokenDoLocalStorage = localStorage.getItem("token");

onMounted(() => {
    if (localStorage.getItem("token") != null) {
        tokenDoLocalStorage.value = localStorage.getItem("token");
    }
})


async function login() {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth', {
            email: inputEmail.value,
            password: inputPassword.value,
        });
        tokenDoLocalStorage.value = response.data.token;
        localStorage.setItem("token", tokenDoLocalStorage.value);
    } catch (error) {
        alert(error.response.data.error);
    }
}

async function logout() {
    const config = {
        headers: {
            Authorization: 'Bearer ' + tokenDoLocalStorage.value // Adiciona o token ao cabeçalho da solicitação
        }
    };
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/logout', {}, config);
        localStorage.removeItem("token");
        tokenDoLocalStorage.value = localStorage.getItem("token");
    } catch (error) {
        alert(error.response.data.error);
    }
}
</script>

<template>
    
    <form v-if="tokenDoLocalStorage == null || tokenDoLocalStorage == ''" @submit.prevent="login">
        <label>Email:</label>
        <input v-model="inputEmail"><br><br>
        <label>Password:</label>
        <input type="password" v-model="inputPassword"><br><br>
        <button>Entrar</button>
    </form>
    <button v-else @click="logout">LOGOUT</button>
    <p>{{ tokenDoLocalStorage }}</p>
</template>