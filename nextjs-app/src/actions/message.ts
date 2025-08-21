"use server"

import axios from "axios";



export const getUsers = async() =>{
    const userRes = await axios.get("http://localhost:8000/user"

    )
    const users = userRes.data;
    if(!users.success){
        console.log("users error",users.message);
    }    

    return users.friends;
}

export const getMessages = async(token:string|null) =>{

    if(!token) return;    
    
    const messageRes = await axios.get(`http://localhost:8000/message`, 
        {
            headers:{
                authorization: "bearer " + token
            }
        }
    )
    console.log("messageRes", messageRes.data.messages);
    
    const messages = messageRes.data;
    if(!messages.success){
        console.log("messages error",messages.message);
    }

    return messages.messages;
}