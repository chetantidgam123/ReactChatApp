import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
  Avatar, Box, Button, Drawer, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'
import { useNavigate } from 'react-router-dom'
import { getSender } from '../../Config/ChatLogic'
import { ChatState, ChatProvider } from '../../Context/ChatProvider'
import { chatWithOther, searchUser } from '../../service'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvtar/UserListItem'
import ProfileModal from './ProfileModal'

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setchats, notification, setNotification } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("User")
    navigate('/');
  }
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      })
      return;
    }
    setLoading(true)
    await searchUser(search)
      .then(async (result) => {
        let responce = await result.data;
        if (responce.code == 200) {
          setSearchResult(responce.user)
        } else {
          toast({
            title: responce.message,
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-right"
          })
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

  }

  const accessChat = async (userId) => {
    setLoadingChat(true)
    await chatWithOther({ "userId": userId })
      .then(async (result) => {
        let responce = await result.data;
        // if (responce.code == 200) {
        if (chats.find((c) => c._id === responce._id)) setchats([responce, ...chats])
        setSelectedChat(responce)
        onClose()
        // } else {
        //   toast({
        //     title: responce.message,
        //     status: "warning",
        //     duration: 5000,
        //     isClosable: true,
        //     position: "top-right"
        //   })
        // }
        setLoadingChat(false)
      }).catch((err) => {
        toast({
          title: err.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        })
        setLoadingChat(false)
      });
  }
  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} bg="white" borderStartWidth={"5px"} w={"100%"} p="5px 10px 5px 10px">
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"}> <i className='fa fa-search' onClick={onOpen}></i>
            <Text d={{ base: "none", md: "flex" }} px={"4"} >Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily={"Work sans"} > Talk-A-Tive</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification?.length && "No New Messages"}
              {
                notification?.map((notify) => (
                  <MenuItem key={notify._id} onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}>
                    {notify?.chat.isGroupChat ? `New Message in ${notify.chat.chatName}` : `New Message From${getSender(user, notify.chat.users)}`}
                  </MenuItem>
                ))
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
              <Avatar size={"sm"} cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

          <DrawerBody >
            <Box display={"flex"} pb={2}>
              <Input placeholder='Search By Name or Email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button
                onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? (<ChatLoading />) : (
              searchResult?.map(ele => (
                <UserListItem key={ele._id} user={ele} handleFunction={() => accessChat(ele._id)} />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display="flex" />}
          </DrawerBody>

          <DrawerFooter>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer