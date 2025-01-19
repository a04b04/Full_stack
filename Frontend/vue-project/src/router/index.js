import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/pages/Home.vue"
import Login from "../views/pages/Login.vue";
import CreateEvent from "../views/pages/CreateEvent.vue";
import CreateAccount from "../views/pages/CreateAccount.vue";

import { nextTick } from "vue";

const ifAuthenticated = (to, from, next) =>{
    const loggedIn = localStorage.getItem('session_token');
    if (loggedIn){
        next()
        return
    }
    next('/Login')
    ifAuthenticated =true;
}


const routes = [
    {path: "/Home", component: Home, },     //beforeEnter: ifAuthenticated add this to deal with authentication
    {path: "/Login", component: Login},
    {path: "/CreateEvent", component: CreateEvent},  //create event route
    {path: "/CreateAccount", component: CreateAccount}, //CreateAccount route
    //{path: "/posts/:id", component: SinglePost}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})



export default router;
