import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { getSender } from '../Config/ChatLogic';
import { ChatState } from '../Context/ChatProvider';
import { fetchChats } from '../service';
import ChatLoading from './ChatLoading';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, setUser, SelectedChat, setSelectedChat, chats, setchats } = ChatState();
  const toast = useToast()


  const fetchchats = async () => {
    await fetchChats()
      .then(async (result) => {
        console.log(result);
        let responce = await result.data;
        setchats(responce)
        // if (responce.code == 200) {
        // } else {
        //   toast({
        //     title: responce.message,
        //     status: "warning",
        //     duration: 5000,
        //     isClosable: true,
        //     position: "top-right"
        //   })
        // }
      }).catch((err) => {
        toast({
          title: err.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        })
      });
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("User")));
    fetchchats()
  }, [])
  console.log(chats);
  return (
    <>
      <Box display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems={"center"}
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth={"1px"}
      >
        <Box pb={3} px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans" display={"flex"} w="100%"
          justifyContent={"space-between"} alignItems="center" >
          My Chats
          <Button display={"flex"}
            fontSize={{ base: "17px", md: "13px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >New Group Chat</Button>
        </Box>
        <Box display={"flex"} flexDir="column"
          p={3} bg="#F8F8F8" w={"100%"} h="100%"
          borderRadius={"lg"} overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((ele) =>
              (
                <Box onClick={() => setSelectedChat(ele)}
                  cursor="pointer" bg={SelectedChat === ele ? "#38B2AC" : "#E8E8E8"}
                  color={SelectedChat === ele ? "white" : "black"} px={3} py={2} borderRadius={"lg"} key={ele._id}
                >
                  <Text>{!ele.isGroupChat ? (
                    getSender(loggedUser, ele.users)
                  ) : (ele.chatName)}</Text>
                </Box>
              )
              )}
            </Stack>
          ) : (<ChatLoading />)}
        </Box>
      </Box>
    </>
  )
}

export default MyChats