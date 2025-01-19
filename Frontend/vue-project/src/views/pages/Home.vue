<template>
    <div>
        <h1>Welcome to Site</h1>
        <ul v-if="posts.length">
            <li v-for="post in posts" :key="post.id">
                <router-link :to="'/posts'+ post.post_id">
                    {{ post.text }}
                </router-link>
            </li>
        </ul>
        
        <div v-if="error">
            {{ error }}
        </div>
    </div>

</template>

<script>
import {postService} from "../../services/posts.service";
export default {
  data() {
    return {
      posts: [],
      
    };
  },
  mounted(){
  }
}
</script>


<style scoped>

</style>