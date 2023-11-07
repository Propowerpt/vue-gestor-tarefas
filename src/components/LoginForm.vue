<script setup>
</script>

<template>
    <form @submit.prevent="adicionar">
        <label>Email:</label>
        <input v-model="inputEmail"><br><br>
        <label>Password:</label>
        <input type="password" v-model="inputPassword"><br><br>
        <button>Entrar</button>
    </form>
</template>