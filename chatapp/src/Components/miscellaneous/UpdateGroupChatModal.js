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
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvtar/UserBadgeItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, SelectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const toast = useToast();


  const handleRemove = () => { }

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
    } catch (error) {

    }
  }

  const handleSearch = () => { }
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