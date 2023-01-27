import { Box } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import ChatBox from '../Components/ChatBox'
import MyChats from '../Components/MyChats'
import SideDrawer from '../Components/miscellaneous/SideDrawer'

const ChatPage = () => {
    //    const {user}= useContext(ChatContext)
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user, setSelectedChat, chats, setchats } = ChatState();
    useEffect(() => {
    }, [])

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display={"flex"} justifyContent={"space-between"} w={"100%"} h={"91vh"} p="10px" >
                {user && <MyChats fetchAgain={fetchAgain}  />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain = {setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage
