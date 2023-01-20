import axios from "axios"
const url = "/api/user"
const config  = {
    headers:{
        "Content-type":"application/json"
    },
}


function registration (body){
    return axios.post("/api/user",body,config)
}

export  {registration}