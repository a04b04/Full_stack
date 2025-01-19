<template>
    <div class = "container">
        <div class="box">
            <form @submit.prevent = "handlesubmit">
                <label for ="email">Email Address: </label>
                <input type="email" id="email" name="email"/>

                <label for ="passowrd">Password:</label>
                <input type ="password" id="password" name="password" />   
                
                <button type="submit">Create Account</button>
            </form>
        </div>

    </div>
</template>

<script>
export default{
    data(){
        return{
            email: "",
            password: ""
        };
    },
    methods: {
    handlesubmit(){
        window.location.reload();
    }
}
};

</script>

<style scoped>
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.box {
  background-color: #60a3d9;
  padding: 40px;
  width: 300px;
  border: 2px solid #60a3d9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.box form {
  display: flex;
  flex-direction: column;
}

.box label {
  margin-bottom: 5px;
  font-weight: bold;
}

.box input {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid yellow;
  border-radius: 5px;
}
</style>