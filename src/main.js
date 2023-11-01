//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import ListaTarefas from './components/ListaTarefas.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/list', component: ListaTarefas },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

createApp(App).use(router).mount('#app')
