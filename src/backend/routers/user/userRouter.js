import { Router } from "express";
import rateLimit from "../../node_modules/express-rate-limit/dist/index.cjs"
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
import verifController from "../../controllers/email/verifController.js";
import UserController from "../../controllers/user/userController.js"
import googleAuthController from "../../controllers/google/googleAuthController.js";
import verifyJWT from "../../controllers/cookies/verifyJWT.js";
import clearCookie from "../../controllers/cookies/logOutController.js"

const userController = new UserController

router.post('/Uses/:id',(req,res) => userController.addUses(req,res))
router.post('/user', (req,res) =>userController.SignIn(req,res))
router.post('/auth/google' , (req,res) => googleAuthController(req,res))
router.post('/login',logInLimiter, (req,res) => userController.logIn(req,res))
router.post('/verification' , (req,res) => verifController(req,res)) 
router.post('/checkCode' , (req,res) => userController.isVerificationCodeCorrect(req,res))

router.get('/logout', (req, res) => {
    clearCookie(res);
    res.status(200).json({ success: true, message: 'Logged out' });
});

router.get('/loginbyid/:id' , (req,res) => userController.getUserByUserId(req,res))
router.get('/cookie' , (req,res) => verifyJWT(req,res))
router.get('/users', (req,res) => userController.getAllUsers(req,res))

router.put('/update/:id', updateLimiter, (req,res) => userController.updateUser(req,res))
router.put('/changePassword', (req,res) => userController.changePassword(req,res))
router.put('/promocode',(req,res) => userController.activatePromocode(req,res))

router.delete('/user/:id', (req,res) =>userController.deleteUser(req,res))

export default router
