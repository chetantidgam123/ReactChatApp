import axios from "axios"
const url = "/api/user"
const config = {
    headers: {
        "Content-type": "application/json"
    },
}


function registration(body) {
    return axios.post(url, body, config)
}
function login(body) {
    return axios.post(url + "/login", body, config)
}

export { registration, login }