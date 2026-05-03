import { Router } from "express";
import { Register, Login} from "../controllers/authentication.controllers.js";
const auth_router = Router();




auth_router.post('/register',Register)

auth_router.post('/login',Login)

auth_router.post('/refresh',()=>{})



export default auth_router;