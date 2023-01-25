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
  } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import { searchUser } from '../../service';
import UserListItem from '../UserAvtar/UserListItem';
import UserBadgeItem from '../UserAvtar/UserBadgeItem';

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const toast = useToast()

    const {user,chats,setCHats} = ChatState();
    
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
    const handleSubmit = ()=>{};
    const handleDelete = ()=>{};
    const handleGroup = (userToAdd)=>{
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
            {selectedUser.map(ele=>(
                <UserBadgeItem key={ele._id} user={ele} handleFunction={()=>handleDelete(ele)} />
            ))}
            {loading?<div>loading...</div>:searchResult?.slice(0,4).map(ele=>(
                <UserListItem key={ele._id} user={ele} handleFunction ={()=>{handleGroup({ele})}}/>
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