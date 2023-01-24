import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ChatContext = createContext();

const ChatProvider = ({children})=>{
    const [user,setUser] = useState()
    const navigate = useNavigate()
    useEffect(() => {
     const userInfo =  JSON.parse(localStorage.getItem('User'))
     setUser(userInfo)
     if(!userInfo){
        navigate('/')
     }
    }, [navigate]);
    
    return(
        <ChatContext.Provider value={{user,setUser}}>
            {children}
        </ChatContext.Provider>
    )
}

 const   ChatState = ()=>{
    return useContext(ChatContext);
}

export  {ChatProvider,ChatState};