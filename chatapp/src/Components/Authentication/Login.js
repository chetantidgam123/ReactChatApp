import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { login } from '../../service'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const [show, setShow] = useState(false)
    const [loading, setloader] = useState(false)
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const handleClick = () => setShow(!show)

    const submitHandler = async () => {
        setloader(true);
        if (!data.email || !data.password) {
            toast({
                title: "Please Fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setloader(false);
            return
        }

        await login(data)
            .then((data) => {
                localStorage.setItem('User', JSON.stringify(data.data))
                setloader(false)
                toast({
                    title: "Login Successful",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                })
                navigate('/chats')
            })
            .catch((err) => {
                console.log(err)
                setloader(false)
            })
    }
    return (
        <VStack spacing={'5'}>
            <FormControl id='email1' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='enter Your Email' value={data?.email} onChange={(e) => { setData({ ...data, email: e.target.value }) }} />
            </FormControl>
            <FormControl id='password1' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} value={data?.password} placeholder='enter Your Password' onChange={(e) => { setData({ ...data, password: e.target.value }) }} />
                    <InputRightElement pr={'1'}>
                        <Button onClick={handleClick} h={'1.75rem'} size={'sm'} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme={'blue'} width="100%" mt={'1.5'} onClick={submitHandler} >
                Login
            </Button>
            <Button isLoading={loading} variant={'solid'} colorScheme={'red'} width="100%" mt={'1.5'} onClick={() => {
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
