import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
const Login = () => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const handleClick = () => setShow(!show)

    const submitHandler = () => { }
    return (
        <VStack spacing={'5'}>
            <FormControl id='email1' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='enter Your Email' onChange={(e) => { setData({ ...data, email: e.target.value }) }} />
            </FormControl>
            <FormControl id='password1' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='enter Your Password' onChange={(e) => { setData({ ...data, password: e.target.value }) }} />
                    <InputRightElement pr={'1'}>
                        <Button onClick={handleClick} h={'1.75rem'} size={'sm'} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme={'blue'} width="100%" mt={'1.5'} onClick={submitHandler} >
                Login
            </Button>
            <Button variant={'solid'} colorScheme={'red'} width="100%" mt={'1.5'} onClick={() => {
                setData({
                    email: "guest@example.com",
                    password: "123456"
                })
            }} >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
