const getEvents = () => {
    return fetch("http://localhost:3333/search")
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw "Something went wrong";
        }
    })

    .then((rJson) => {
        return rJson;
    })

    .catch(error => {
        console.log("Err", error);
        return Promise.reject(error);
    });
}

export const getService ={
    getEvents,
}
