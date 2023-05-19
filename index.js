const express=require('express')
const cors=require('cors')
const app=express()

const authRoutes=require('./routes/authRoutes.js');

require('dotenv').config()
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.use('/auth',authRoutes);
app.get('/',(req,res)=>{
    res.send('hello world')
})
const PORT=5000;

app.listen(process.env.PORT || PORT);