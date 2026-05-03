import express from "express"
import connectDB from "./database/db.js"
import auth_router from "./routers/authentication.js"
import isAuthenticated from "./middlewares/auth.middlewares.js"
import user_router from "./routers/user.js"
import errorMiddleware from "./middlewares/error.middleware.js"
import cookieParser from "cookie-parser"
import subs_router from "./routers/subscriptions.js"
import { rateLimit } from "express-rate-limit"
import Tasks from "./jobs/main.js"

const app = express()

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//throttling
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	message: { error: "Too many requests, please try again later." },
    validate: {
        keyGeneratorIpFallback: false, // Disable the IPv6 validation
    },
    keyGenerator: (req,res)=>{
        return req.user ? req.user._id : req.ip;
    }
})
app.use(limiter)

//routers
app.use('/auth',auth_router)
app.use('/users',user_router)
app.use('/subs',isAuthenticated,subs_router)


Tasks()

app.use(errorMiddleware)

//server
app.listen(3000,async ()=>{
    console.log('the app is listening on http://localhost:3000')
    await connectDB()
})