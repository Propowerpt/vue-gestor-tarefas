//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import Home from './components/Home.vue'
import ListaTarefas from './components/ListaTarefas.vue'
import LoginForm from './components/LoginForm.vue'

function isAutheticated(){
  return (localStorage.getItem("token") == null || localStorage.getItem("token") == '') ? false : true;
}

const routes = [
  { 
    path: '/', 
    component: Home },
  { 
    path: '/login', 
    component: LoginForm 
  },
  { 
    path: '/list', 
    component: ListaTarefas,
    //Verificar se está autenticado
    beforeEnter: (to, from) => {
      if(!isAutheticated()){
      alert("É preciso fazer login antes de prosseguir !!!");
      return '/login'
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

const app = createApp(App);
app.use(router);
app.use(createVuestic());
app.mount('#app');
//createApp(App).use(router).mount('#app')
