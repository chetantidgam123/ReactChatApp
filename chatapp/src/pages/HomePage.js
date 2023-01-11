import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'

const HomePage = () => {
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
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
