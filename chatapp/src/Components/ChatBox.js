import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { user, setUser, SelectedChat, setSelectedChat, chats, setchats } = ChatState();
  return (
    <Box display={{base:SelectedChat?"flex":"none", md:"flex"}}
      w={{base:"100%", md:"68%"}}
      borderRadius={"lg"}
      borderWidth="1px"
      bg={"white"}
      alignItems="center"
      flexDir={"column"}
      p={3}
    >
     <SingleChat fetchAgain={fetchAgain} setFetchAgain = {setFetchAgain} />
    </Box>
  )
}

export default ChatBox