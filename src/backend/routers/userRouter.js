import { Router } from "express";
import rateLimit from "../node_modules/express-rate-limit/dist/index.cjs"
const router = new Router

const logInLimiter = rateLimit({
    windowMs : 1 * 60 * 1000,
    max : 5,
    handler : (req,res)=>{
        res.status(429).json({
            status : 429,
            message : "You have exceeded the request limit. Try again later"
        })
    },
    skip : (req,res) => {
        const allowedIPs = ["181.177.126.105"," 5.101.13.116"]
        return allowedIPs.includes(req.ip)
    }
})

const registerLimiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    max: 5, 
    handler : (req,res)=>{
        res.status(429).json({
            status : 429,
            message : "You have exceeded the request limit. Try again later"
        })
    },
    skip : (req,res) => {
        const allowedIPs = ["181.177.126.105"," 5.101.13.116"]
        return allowedIPs.includes(req.ip)
    }
  });

  const updateLimiter = rateLimit({
    windowMs: 1440 * 60 * 1000,
    max: 2, 
    handler : (req,res)=>{
        res.status(429).json({
            status : 429,
            message : "You have exceeded the request limit. Try again later"
        })
    },
    skip : (req,res) => {
        const allowedIPs = ["181.177.126.105","5.101.13.116"]
        return allowedIPs.includes(req.ip)
    }
  });
import verifController from "../controllers/verifController.js";
import UserController from "../controllers/userController.js";
import googleAuthController from "../controllers/googleAuthController.js";
import verifyJWT from "../controllers/verifyJWT.js";

const userController = new UserController

router.post('/Uses/:id',(req,res) => userController.addUses(req,res))
router.post('/user',  (req,res) =>userController.addUser(req,res))
router.post('/auth/google' , (req,res) => googleAuthController(req,res))
router.post('/login' , logInLimiter, (req,res) => userController.getUserByPassword(req,res))
router.post('/verification', (req,res) => verifController(req,res))

router.get('/loginbyid/:id' , (req,res) => userController.getUserByUserId(req,res))
router.get('/cookie' , (req,res) => verifyJWT(req,res))
router.get('/users', (req,res) => userController.getAllUsers(req,res))

router.put('/update/:id', (req,res) =>userController.updateUser(req,res))
router.delete('/user/:id', (req,res) =>userController.deleteUser(req,res))

export default router
