import express from 'express'
import jwt from 'jsonwebtoken'
import  'dotenv/config'

const app = express()

const data = [
    {
        "userName" :   "Manas",
        "data": "Data of Manas"
    },
    {
        "userName" :   "Hrishi",
        "data": "Data of Hrishi"
    }
]

app.use(express.json())

app.get('/',(req,res)=>{
    
    return res.status(200).send("Hello Ji")
})

const  authToken = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(" ")[1] 
    if (token == null) throw new Error(401)
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            console.log('*****ERROR******',err)
            return res.sendStatus(403)
        } 
        req.user = user 
    }) 
    next()
}


app.post('/login',(req,res)=>{
    
    const userName = req.body.userName
    const user = {name:userName}
    res.json({accesstoken: jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)})

})


app.get('/data',authToken,(req,res)=>{
    console.log(req.user)
    return res.status(200).send(data.filter(d => d.userName === req.user.name))

})

app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000")
})