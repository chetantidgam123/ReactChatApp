import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import { io } from 'socket.io-client'
import { getSender, getSenderFull } from '../Config/ChatLogic'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
import "./style.css";
import animationData from '../animations/typing.json'
const ENDPOINT = "http://localhost:5000";
var socket, SelectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const { user, SelectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [istyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const toast = useToast()
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

            socket.emit('join chat', SelectedChat._id)
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
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on('typing', () => { setIsTyping(true) })
        socket.on('stop typing', () => { setIsTyping(false) })
    }, []);

    useEffect(() => {
        fetchMessages()
        SelectedChatCompare = SelectedChat;
    }, [SelectedChat])

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!SelectedChatCompare || SelectedChatCompare._id != newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    })



    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop typing', SelectedChat._id)
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
                socket.emit('new message', data);
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

        if (!socketConnected) {
            return
        }
        if (!typing) {
            setTyping(true)
            socket.emit('typing', SelectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timeLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timeLength && typing) {
                socket.emit('stop typing', SelectedChat._id)
                setTyping(false)
            }
        }, timeLength);
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
                                {istyping ? <div><Lottie
                                    width={70}
                                    options={defaultOptions}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                /></div> : <></>}
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