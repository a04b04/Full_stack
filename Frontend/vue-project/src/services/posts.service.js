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
    .then((response) => {
        if(response.status === 200){
            return response.json();
        }else if(response.status === 400){
            throw 'Bad request';
        }else{
            throw 'Something went wrong';
        }
    })

    .then(rJson => {
        localStorage.setItem("user_id", rJson.user_id);
        localStorage.setItem("session_token", rJson.session_token)
        return rJson;
    })
    
    .catch(err => {
        console.log(err);
        return Promise.reject(err);
    })

}

const logOut =() =>{
    return fetch("http://localhost:3333/logout",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": localStorage.getItem("session_token")
            }
        })
        .then((response) =>{
            if(response.status ===200){
                localStorage.removeItem("user_id")
                localStorage.removeItem("session_token")
                return response.json();
            }else if(response.status ===401){
                throw "Not logged in"
            }else{
                throw "Something went wrong"
            }
        })
        .catch ((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        })
}


const registerNewUser = (email, password) => {
    return fetch("http://localhost:3333/create_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw 'Failed to create account';
        }
      })
      .catch(error => {
        console.error('Error creating account:', error);
        throw error;
      });
  };


export const postService ={
    login,
    logOut,
    registerNewUser,
}