<script setup>
import axios from 'axios'
import VueAxios from 'vue-axios'
import { ref, computed, onMounted } from 'vue'
import TarefaForm from './TarefaForm.vue';
let id = 1;
const inputTitulo = ref('');
const inputDescricao = ref('');
const tarefaIdSelecionado = ref(0);
const listaTarefas = ref([]);
const colunas = ref([
  { name: 'titulo', align: 'center', label: 'Titulo', field: 'titulo' },
  { name: 'descricao', label: 'Desc.', field: 'descricao' },
]);

const opcoesOrdenar = ref([
  { value: '', descricao: "ordenar por..." },
  { value: 'id', descricao: "ordenar por id" },
  { value: 'nome', descricao: "ordenar por nome" },
])
const opcaoSelecionada = ref('');
const tituloPesquisa = ref('');

onMounted(() => {
  getLista();
})

async function getLista() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/tarefas', {
      params: {
        titulo: tituloPesquisa.value,
      }
    });
    listaTarefas.value = response.data.data;
  } catch (error) {
    console.error('Ocorreu um erro ao adicionar a tarefa:', error);
  } finally {
    //isLoading.value = false;
  }
}

const filteredTarefas = computed(() => {
  if (opcaoSelecionada.value == "") {
    return listaTarefas.value;
  } else if (opcaoSelecionada.value == "id") {
    //com os metodos sort e reverse é necessario fazer desta forma ara nao alterar 
    //faça uma cópia da array e então reverta a cópia usar esta sintaxe[...lista].
    return [...listaTarefas.value].sort((a, b) => a.id - b.id);
  } else if (opcaoSelecionada.value == "nome") {
    return [...listaTarefas.value].sort((a, b) => a.titulo.localeCompare(b.titulo));
  }
})

async function adicionar() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/tarefas', {
      titulo: inputTitulo.value,
      descricao: inputDescricao.value,
    });
    getLista();
    limparCampos();
  } catch (error) {
    console.error('Ocorreu um erro ao adicionar a tarefa:', error);
  }
}

async function selecionarIdTarefa(tarefa) {
  tarefaIdSelecionado.value = tarefa.id;
}


async function apagar(tarefa) {
  if (confirm("Deseja mesmo apagar esta tarefa?")) {
    try {
      const response = await axios.delete('http://127.0.0.1:8000/api/tarefas/' + tarefa.id);
      getLista();
    } catch (error) {
      console.error('Ocorreu um erro ao apagar a tarefa:', error);
    }
  }
}

function limparCampos() {
  inputTitulo.value = "";
  inputDescricao.value = "";
}

function realizarPesquisa() {
  getLista();
}

async function claimTask(tarefa) {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/tarefas/'+tarefa.id+'/claim', {});
    alert("Atribuição da tarefa feita com sucesso !!!");
  } catch (error) {
    alert(error.response.data.error);
  }
}


</script>

<template>
  <div>
    <form @submit.prevent="adicionar">
      <label>Titulo:</label>
      <input v-model="inputTitulo">
      <label>Descrição:</label>
      <input v-model="inputDescricao">
      <button>Adicionar</button>
    </form>
    <br><br>
    <select @change="ordenarPor" name="opcoes" id="opcoes" v-model="opcaoSelecionada">
      <option v-for="opcao in opcoesOrdenar" :key="opcao.value" :value="opcao.value">{{ opcao.descricao }}</option>
    </select>
    <input @input="realizarPesquisa" v-model="tituloPesquisa">

    <table>
      <tr>
        <th>Id</th>
        <th>Titulo</th>
        <th>Descrição</th>
        <th>Actions</th>
      </tr>
      <tr v-for="tarefa in filteredTarefas" :key="tarefa.id">
        <th>{{ tarefa.id }}</th>
        <th>{{ tarefa.titulo }}</th>
        <th>{{ tarefa.descricao }}</th>
        <th>
          <button @click="claimTask(tarefa)">Aceitar tarefa</button>
          &nbsp
          <button @click="selecionarIdTarefa(tarefa)">Edit</button>
          &nbsp
          <button @click="apagar(tarefa)">X</button>
        </th>
      </tr>
    </table>
  </div>


  <TarefaForm :tarefaId="tarefaIdSelecionado" @fecharTarefa="() => { tarefaIdSelecionado = 0; }"
    @tarefaAtualizada="() => { getLista(); }" />
</template>


<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>