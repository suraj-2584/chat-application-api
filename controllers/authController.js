const {connect} = require('getstream')
const bcrypt  = require('bcrypt')
const StreamChat= require('stream-chat').StreamChat
const crypto= require('crypto')
require('dotenv').config()
const api_key=process.env.API_KEY
const api_secret=process.env.API_SECRET
const app_id=process.env.APP_ID

const login=async (req,res)=>{
    try{
        const {userName,password} = req.body
        const serverClient=connect(api_key,api_secret,app_id)
        const client=StreamChat.getInstance(api_key,api_secret)

        const {users} = await client.queryUsers({name:userName})

        if(!users.length) return res.status(400).json({message:'user not found'})
        const success= bcrypt.compare(users[0].hashedPassword,password)

        const token = serverClient.createUserToken(users[0].id)
        
        if(!success){
            res.status(500).json({message:'wrong password'});
        }
        else res.status(200).json({token,userId:users[0].id,userName,fullName:users[0].fullName})
    }
    catch(error){
        res.status(500).json({message:error})
    }
}
const signup=async (req,res)=>{
    try{
        const {fullName,userName,password,phoneNumber} = req.body 

        const userId=crypto.randomBytes(16).toString('hex')
        
        const serverClient=connect(api_key,api_secret,app_id)
        
        const hashedPassword=await bcrypt.hash(password,10)

        const token=serverClient.createUserToken(userId)

        res.status(200).json({token,hashedPassword,userId,fullName,userName,phoneNumber})

    }
    catch(error){
        res.status(500).json({message:error})
    }


}

module.exports = {login,signup}