import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '../components/SignIn'
import SignUp from "../components/SignUp";
import allChats from "../components/allChats";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/chats',
    name: 'allChats',
    component: allChats
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
