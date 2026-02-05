import express from "express"
import { userData } from "./data.js";
import { mid1, validationPost } from "./middleware.js";


const app = express();
const port = 3000;


app.use(express.json())
app.use(mid1)

//req -> middleware -> res

// http://localhost:3000
app.get("/", (req,res)=>{
    res.send("home route")
})

// http://localhost:3000/user
app.get("/user", (req,res)=>{

   return res.json(userData)
})
//http://localhost:3000/user/2
app.get("/user/:id", (req,res)=>{
    const id = parseInt(req.params.id);

    const user = userData.find((ele)=> ele.id === id);

    if(!user){
      return res.json({
            message:"user not found"
        })
    }

   return res.json(user)
})
//http://localhost:3000/search?name=raj&password="qwert&quot;
app.get("/search",(req,res)=>{
    console.log(req.query)
   
    const userName = req.query.name;
    const userPassword = req.query.password
    res.send({
        userName,userPassword
    })
})

//http://localhost:3000/user --post
app.post("/user",validationPost,(req,res)=>{

    let {name,city} = req.body;


    let newUserdata = {
        id:userData.length+1,
        name:name,
        city:city
    }
    userData.push(newUserdata)
    res.status(200).json({
        message:"User Created"
    })

})


app.listen(port,()=>{
    console.log("server is running")
})



export let mid1 = (req,res,next)=>{
    console.log(`${req.url} method ${req.method}`)
    console.log("this is mid 1")
    next()
}

export let validationPost= (req,res,next)=>{
    let {name,city} = req.body;

    //validation
    if(!name || !city){
        return res.status(400).json({
            message:"name and city field cannot be empty"
        })
    }
    next();
}