import axios from "axios"
const userUrl = "/api/user"
const chatUrl = "/api/chat"
const user = JSON.parse(localStorage.getItem("User"))
const config = {
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user?.token}`
    },
}


function registration(body) {
    return axios.post(userUrl, body, config)
}
function login(body) {
    return axios.post(userUrl + "/login", body, config)
}

function searchUser(name) {
    return axios.get(userUrl + "?search=" + name, config)
}
function chatWithOther(id) {
    return axios.post(chatUrl, id, config)
}
function fetchChats() {
    return axios.get(chatUrl, config)
}

export { registration, login, searchUser, chatWithOther, fetchChats }