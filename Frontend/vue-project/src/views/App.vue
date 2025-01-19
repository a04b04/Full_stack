<template>
  <div>
    <!--<h1>{{ welcome_message }}</h1>-->
    <!--<Login />-->
  </div>

  <div>
    <nav class="horizontalNav">
      <router-link to="/Login">Login</router-link>
      <router-link to="/Home">Home</router-link>
      <router-link to="/CreateEvent">CreateEvent</router-link>
      <!--{path: "/posts/:id", component: SinglePost} -->
    </nav>
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import Login from "../views/pages/Login.vue"
import Home from "./pages/Home.vue";
import { postService } from "@/services/posts.service";

export default{
    data(){
      return {
        welcome_message: "Hellowww world!!!"
      }
    },
    components: {
      Home
    }

  }

</script>

<style scoped>
.horizontalNav{
  display: flex;
  justify-content: space-between;
  background-color: #66b7f8;
}
.horizontalNav a{
  padding: 10px;
  text-decoration: none;
  color: black;
}
.horizontalNav a:hover{
  background-color: #72c0ff;
}

</style>