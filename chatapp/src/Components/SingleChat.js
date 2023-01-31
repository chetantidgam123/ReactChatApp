import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../Config/ChatLogic'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
import "./style.css";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const { user, SelectedChat, setSelectedChat } = ChatState()
    const toast = useToast()

    useEffect(() => {
        fetchMessages()
    }, [SelectedChat])


    const fetchMessages = async () => {
        if (!SelectedChat) return;
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user?.token}`
                },
            }
            setLoading(true)
            const { data } = await axios.get(`/api/message/${SelectedChat._id}`, config)
            console.log(messages);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occoured!",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right"

            })

        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user?.token}`
                    },
                }
                setNewMessage('');
                const { data } = await axios.post('/api/message', {
                    "content": newMessage,
                    "chatId": SelectedChat._id
                }, config
                );
                console.log(data);
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occoured!",
                    description: "Failed to send Message",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"

                })

            }
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }
    return (
        <>
            {
                SelectedChat ? (
                    <>
                        <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily={"Work sans"}
                            display="flex" justifyContent={{ base: "space-between" }} alignItems="center"
                        >
                            <IconButton display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {!SelectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, SelectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, SelectedChat.users)} />
                                </>) : (
                                <>
                                    {SelectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                                </>
                            )}
                        </Text>
                        <Box display={"flex"} flexDir="column" justifyContent={"flex-end"} p={3} bg={"#E8E8E8"} w="100%" h={"100%"} borderRadius="lg" overflowY={"hidden"}>
                            {loading ? (<Spinner size={"lg"} w={20} h={20} alignSelf="center" margin={"auto"} />) : (
                                <div className='messages'>
                                    <ScrollableChat messages={messages} />
                                </div>
                            )}
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input variant={"filled"} bg="#E0E0E0" placeholder='Enter a message' onChange={typingHandler} value={newMessage} />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h="100%">
                        <Text fontSize={"3xl"} pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat