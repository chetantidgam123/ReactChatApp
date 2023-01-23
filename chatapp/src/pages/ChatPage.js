import { Box } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../miscellaneous/SideDrawer'

const ChatPage = () => {
   const {user}= ChatState()
    useEffect(() => {
    }, [])

    return (
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}
            <Box>
                {/* {user && <MyChats/>} */}
                {/* {user && <ChatBox/>} */}
            </Box>
        </div>
    )
}

export default ChatPage
