const login = (email, password) =>{
    return fetch("http://localhost:3333/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            "email": email,
            "password": password
        })

    })
    .then(response => {
        if(response.status === 200){
            return response.json();
        }else if(response.status === 400){
            throw 'Bad request';
        }else{
            throw 'Something went wrong'
        }
    })

    .then(rJson => {
        localStorage.setItem("user_id", rJson.user_id);
        localStorage.setItem("session_token", rJson.session_token)
        return rJson
    })
    
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })

}

export const postService ={
    login,
}