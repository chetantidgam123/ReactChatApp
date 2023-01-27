import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import { searchUser } from '../../service';
import UserListItem from '../UserAvtar/UserListItem';
import UserBadgeItem from '../UserAvtar/UserBadgeItem';
import axios from 'axios';

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const toast = useToast()

    const {user,chats,setchats} = ChatState();
    
    const handleSearch = async (query)=>{
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
                title: err.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
              })
              setLoading(false)
            });

    };
    const handleSubmit = async ()=>{
      if(!groupChatName|| !selectedUser){
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        })
        return
      }

      try {
        const config = {
          headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user?.token}`
          },
      };

      const {data} = await axios.post('/api/chat/group',{
        name:groupChatName,
        users:JSON.stringify(selectedUser.map((u)=>u._id))
      },
      config
      );
      setchats([data,...chats])
      onClose();
      toast({
        title: "New Group Chat Created",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      })
        
      } catch (error) {
        toast({
          title: "Failed to Create Group Chat",
          description:error.response.data,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        })
      }
    };


    const handleDelete = (delUser)=>{
      setSelectedUser(selectedUser.filter((sel)=>sel._id!==delUser._id))
    };


    const handleGroup =  (userToAdd)=>{
        if(selectedUser.includes(userToAdd)){
            toast({
                title: "User Already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
              })
              return;
        }
        setSelectedUser([...selectedUser,userToAdd]);
    };


  return (
    <>
    <span onClick={onOpen}>{children}</span>
         <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"35px"} fontFamily={"Work sans"} display={"flex"} justifyContent="center" >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems="center" >
            <FormControl>
                <Input placeholder='Chat Name' mb={3} onChange={(e)=>{setGroupChatName(e.target.value)}} />
            </FormControl>
            <FormControl>
                <Input placeholder='Add Users eg:Jhon,chetan,suraj' mb={3} onChange={(e)=>{handleSearch(e.target.value)}} />
            </FormControl>
            <Box display={"flex"} w={"100%"} flexWrap="wrap">
            {selectedUser.map((ele)=>(
                <UserBadgeItem key={ele._id} user={ele} handleFunction={()=>handleDelete(ele)} />
            ))}
            </Box>
            {loading?<div>loading...</div>:searchResult?.slice(0,4).map((ele)=>(
                <UserListItem key={ele._id} user={ele} handleFunction ={()=>{handleGroup(ele)}}/>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
             Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel