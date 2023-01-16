import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        cnfPassword: '',
        pic: ''
    })
    const handleClick = () => setShow(!show)

    const postDetails = (pics) => { }

    const submitHandler = () => { }
    return (
        <VStack spacing={'5'}>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='enter Your Name' onChange={(e) => { setData({ ...data, name: e.target.value }) }} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='enter Your Email' onChange={(e) => { setData({ ...data, email: e.target.value }) }} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='enter Your Password' onChange={(e) => { setData({ ...data, password: e.target.value }) }} />
                    <InputRightElement pr={'1'}>
                        <Button onClick={handleClick} h={'1.75rem'} size={'sm'} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='cnf_password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='Confirm Password' onChange={(e) => { setData({ ...data, cnfPassword: e.target.value }) }} />
                    <InputRightElement pr={'1'}>
                        <Button onClick={handleClick} h={'1.75rem'} size={'sm'} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' isRequired>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input type={'file'} p={'1.5'} accept="image/*" onChange={(e) => { postDetails(e.target.files[0]) }} />
            </FormControl>
            <Button colorScheme={'blue'} width="100%" mt={'1.5'} onClick={submitHandler} >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
