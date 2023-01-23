import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    const userInfo =  JSON.parse(localStorage.getItem('User'))
    if(userInfo){
       navigate('/chats')
    }
   }, [navigate])
  return (
    <Container maxW={'xl'} centerContent>
      <Box display={'flex'}
        justifyContent={'center'}
        p={3}
        bg={'white'}
        w='100%'
        borderRadius='lg'
        borderWidth="1px"
        m={"40px 0 15px 0"}>
        <Text fontSize='4xl' fontFamily="Work sans" color="black">Talk-A-Tive</Text>
      </Box>
      <Box bg={'white'} w='100%' p={4} borderRadius='lg' borderWidth="1px" >
        <Tabs variant='soft-rounded'>
          <TabList mb={'1em'}>
            <Tab width={'50%'} >Login</Tab>
            <Tab width={'50%'} >Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
