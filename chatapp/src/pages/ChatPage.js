import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ChatPage = () => {
    const [chats, setChats] = useState([])
    const fetchChat = async () => {
        const { data } = await axios.get('/api/chats')
        setChats(data)
    }
    useEffect(() => {
        // fetchChat();
    }, [])

    return (
        <div>
            {
                chats.map((chat) => {
                    return (
                        <div key={chat._id}>{chat.chatname}</div>
                    )
                })
            }
        </div>
    )
}

export default ChatPage
