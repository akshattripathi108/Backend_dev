import express from "express"
import { userData } from "./data.js";
import { mid1, validationPost } from "./middleware.js";
import { getEndpoint } from "./get_endpoint_new.js";
import { postEndpoint } from "./post_endpoint.js";
import { putEndpoint } from "./put_endpoint.js";
import { patchEndpoint } from "./patch_endpoint.js";
import { traceEndpoint } from "./trace_endpoint.js";
import { changePasswordEndpoint } from "./change_password_endpoint.js";
import { forgotPasswordEndpoint } from "./forgot_password_endpoint.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.static(__dirname)) // Serve static files (HTML, CSS, JS)
app.use(mid1)

// ============ SERVE REGISTRATION PAGE ============
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'registration_page.html'));
})

// ============ INTEGRATED HTTP ENDPOINTS ============

// GET Endpoint - Retrieve user(s)
getEndpoint(app);

// POST Endpoint - Register/Create new user
postEndpoint(app);

// PUT Endpoint - Replace entire user record
putEndpoint(app);

// PATCH Endpoint - Partial update of user record
patchEndpoint(app);

// TRACE Endpoint - Echo request details
traceEndpoint(app);

// PASSWORD MANAGEMENT ENDPOINTS
changePasswordEndpoint(app);
forgotPasswordEndpoint(app);

// ============ LEGACY ENDPOINTS (kept for compatibility) ============

// http://localhost:3000/user
app.get("/user", (req,res)=>{
   return res.json(userData)
})

//http://localhost:3000/user/:id
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

//http://localhost:3000/search?name=raj&password="qwert"
app.get("/search",(req,res)=>{
    console.log(req.query)
   
    const userName = req.query.name;
    const userPassword = req.query.password
    res.send({
        userName,userPassword
    })
})

//http://localhost:3000/user --post (legacy)
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
    console.log(`Server is running on http://localhost:${port}`)
    console.log("Available endpoints:")
    console.log("  GET  /              - Registration page")
    console.log("  GET  /get           - Get all users")
    console.log("  GET  /get/:id       - Get user by ID")
    console.log("  POST /post          - Register new user")
    console.log("  PUT  /put/:id       - Update entire user (PUT)")
    console.log("  PATCH /patch/:id    - Partial update (PATCH)")
    console.log("  PUT  /change-password/:id - Change user password")
    console.log("  POST /forgot-password    - Request password reset")
    console.log("  POST /reset-password     - Reset password with token")
    console.log("  TRACE /trace        - Request trace")
})