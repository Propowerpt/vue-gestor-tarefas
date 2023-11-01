<script setup>
import axios from 'axios'
import VueAxios from 'vue-axios'
import { ref, onMounted, watch } from 'vue'
const inputTitulo = ref('');
const inputDescricao = ref('');
const emit = defineEmits(['fecharTarefa', 'tarefaAtualizada']);
const props = defineProps({
    tarefaId: Number
});

watch(() => props.tarefaId, () => { getTarefa(); });

async function getTarefa() {
    if (props.tarefaId > 0) {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tarefas/' + props.tarefaId + '/edit');
            inputTitulo.value = response.data.data.titulo;
            inputDescricao.value = response.data.data.descricao;
        } catch (error) {
            console.error('Ocorreu um erro no get da tarefa:', error);
        }
    }
}
async function atualizar() {
    try {
        const response = await axios.put('http://127.0.0.1:8000/api/tarefas/' + props.tarefaId, {
            titulo: inputTitulo.value,
            descricao: inputDescricao.value,
        });
        emit('tarefaAtualizada');
    } catch (error) {
        console.error('Ocorreu um erro ao atualizar a tarefa:', error);
    }
}

function fecharTarefa() {
    emit('fecharTarefa');
}

</script>

<template>
    <div class="form-tarefa" v-if="tarefaId > 0">
        <h4>Atualizar tarefa {{ tarefaId }}</h4>
        <form @submit.prevent="atualizar">
            <br>
            <label>Titulo</label>
            <br>
            <input v-model="inputTitulo">
            <br>
            <label>Descrição</label>
            <br>
            <input v-model="inputDescricao">
            <br>
            <button>Atualizar</button>
        </form>
        <button @click="fecharTarefa">Fechar Janela</button>
    </div>
</template>


<style>
.form-tarefa {
    padding: 10px;
    border: solid;
}
</style>