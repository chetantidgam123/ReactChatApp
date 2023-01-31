import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
  IconButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvtar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvtar/UserListItem';
import { searchUser } from '../../service';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, SelectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const toast = useToast();


  const handleRemove = async (user1) => {
    if (SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admin can Remove Someone!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
      return
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
      }
      const { data } = await axios.put("/api/chat/groupremove", {
        chatId: SelectedChat._id,
        userId: user1._id
      }, config
      )
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
      onClose()
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setSelectedChat(data)
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occoured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
      setLoading(false);
    }
  }

  const handleAdd = async (user1) => {
    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in Group",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
      return;
    }
    if (SelectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add Someone!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
      }
      const { data } = await axios.put('/api/chat/groupadd', {
        chatId: SelectedChat._id,
        userId: user1._id
      }, config
      )
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occoured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
      setLoading(false);
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
      }
      const { data } = await axios.put('/api/chat/rename', {
        chatId: SelectedChat._id,
        chatName: groupChatName
      }, config
      )
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false)
    } catch (error) {
      toast({
        title: "Error Occoured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
      setRenameLoading(false);
      setGroupChatName("");
    }
  }

  const handleSearch = async (query) => {
    setSearch(query)
    if (!search) {
      return;
    }
    setLoading(true)
    await searchUser(search)
      .then(async (result) => {
        let responce = await result.data;
        if (responce.code == 200) {
          setSearchResult(responce.user)
        } else {
          setSearchResult(responce.user)
        }
        setLoading(false)
      }).catch((err) => {
        toast({
          title: "Error Occoured!",
          description: "Failed to load the Search Result",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        })
        setLoading(false)
      });

  };
  return (
    <>
      <IconButton display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} >Open Modal</IconButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" >{SelectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display="flex" flexWrap={"wrap"} >
              {SelectedChat.users.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
              <Button variant={"solid"} colorScheme={"teal"} ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
            </FormControl>
            <FormControl>
              <Input placeholder='Add User to Group' mb={1} onChange={(e) => { handleSearch(e.target.value) }} />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (searchResult.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => { handleAdd(user) }} />
            )))}
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button> */}
            <Button colorScheme='red' mr={3} onClick={() => { handleRemove(user) }}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal