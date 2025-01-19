<template>
    <div>
    <h1> Login </h1>
    
    <form @submit.prevent="handleSubmit">
        <label for = "email">Email: </label>
        <input type="email" name="email" v-model="email" />
        <div v-show="submitted && !email">Email is required</div>

        <br /><br />

        <label for="password">Password: </label>
        <input type="password" name="password" v-model="password" />
        <div v-show="submitted && !password">Password is required</div>
        <h2>{{ email + " " + password }}</h2>
        <button>Login</button>

        <br /> <br />
    </form>
    <div class="create-account">
        <router-link to = "/CreateAccount">Create Account</router-link>
    </div>
</div>
</template>

<script>
import { postService } from '@/services/posts.service';
    export default{
        data(){
            return {
                email: "",
                password: "",
                submitted: false
                //error: null
            }
        },

        methods: {
            handleSubmit(e){
                this.submitted = true
                const{email, password} = this
                alert("Button clicked")
                if(!(email && password)){
                    return;
                }
                postService.login(this.email,this.password)
                .then(response =>{
                    console.log('Login successful');
                })
                .catch(error=> {
                    console.error('Login failed',error);
                    this.error = 'Login failed check credentials';
                })
                    
                //fill in with more code to deal with if login function aint working=
            }
        }
    }
</script>

<style scoped>
.create-account a{
    text-decoration: underline;
    color: #60a3d9;
    cursor: pointer;
}

</style>