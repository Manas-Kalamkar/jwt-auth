import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'


const app = express()

app.use(express.json())

const generateAccessToken = (user) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20s'})
}

let refreshtokens = []
app.post('/login',(req,res)=>{

    const userName = req.body.userName
    const user = {name:userName}

    const accesstoken = generateAccessToken(user)
    const refreshtoken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshtokens.push(refreshtoken)
    return res.json({accesstoken: accesstoken, refreshtoken :refreshtoken})
})


app.post('/token',(req,res)=>{
    const refreshtoken = req.body.token
    if( refreshtoken == null) return res.sendStatus(401)
    console.log(refreshtoken,refreshtokens)
    if(!refreshtokens.includes(refreshtoken)) return res.sendStatus(403)


    jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        console.log(err)
        if(err) return res.status(403)
        const accessToken = generateAccessToken({name:user.name})
        res.json({accesstoken:accessToken})
    })

    

})









app.listen(4000,()=>{
    console.log("Auth Server is running on http://localhost:4000")
})