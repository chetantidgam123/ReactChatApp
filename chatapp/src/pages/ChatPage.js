import { Box } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import ChatBox from '../miscellaneous/ChatBox'
import MyChats from '../miscellaneous/MyChats'
import SideDrawer from '../miscellaneous/SideDrawer'

const ChatPage = () => {
//    const {user}= useContext(ChatContext)
   const {user}= ChatState()
    useEffect(() => {
    }, [])

    return (
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}
            <Box display={"flex"} justifyContent={"space-between"} w={"100%"} h={"91vh"} p="10px" >
                {user && <MyChats/>}
                {user && <ChatBox/>}
            </Box>
        </div>
    )
}

export default ChatPage
