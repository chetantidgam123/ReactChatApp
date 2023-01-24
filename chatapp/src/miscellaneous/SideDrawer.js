import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react'
import React, { useState } from 'react'
import  {ChatState,ChatProvider}  from '../Context/ChatProvider'
import ProfileModal from './ProfileModal'

const SideDrawer = () => {
  const {user} = ChatState()
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([])
  const[loading,setLoading] = useState(false)
  const[loadingChat,setLoadingChat] = useState()
  return (
    <>
     <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} bg="white" borderStartWidth={"5px"} w={"100%"}  p="5px 10px 5px 10px">
      <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
        <Button variant={"ghost"}> <i className='fa fa-search'></i>
        <Text d={{ base:"none" , md: "flex" }} px={"4"} >Search User</Text>
         </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily={"Work sans"} > Talk-A-Tive</Text>
      <div>
      <Menu>
        <MenuButton p={1}>
            <BellIcon fontSize={"2xl"} m={1}/>
        </MenuButton>
        {/* <MenuList></MenuList> */}
      </Menu>
      <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
    <Avatar size={"sm"} cursor="pointer" name={user.name} src={user.pic} />
      </MenuButton>
      <MenuList>
        <ProfileModal user={user}>
        <MenuItem>My Profile</MenuItem>
        </ProfileModal>
        <MenuDivider/>
        <MenuItem>Logout</MenuItem>
      </MenuList>
      </Menu>
      </div>
     </Box>
      </>
  )
}

export default SideDrawer