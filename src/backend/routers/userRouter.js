import { Router } from "express";
const router = new Router();

import { logInLimiter, registerLimiter, updateLimiter } from "./limiters/userRouterLimiters.js";

import verifyJWT from "../cookies/verifyJWT.js";
import clearCookie from "../cookies/clearCookies.js";
import {
  AddUses,
  SignIn,
  LogIn,
  GetUserById,
  ChangeUserName,
  ActivatePromocode,
} from "../controllers/userController.js";
import AuthThroughGoogle from "../controllers/googleAuthController.js";
import verifController from "../modules/verifModule.js";

router.post("/Uses/:id", (req, res) => AddUses(req, res));
router.post("/user", registerLimiter, (req, res) => SignIn(req, res));
router.post("/auth/google", (req, res) => AuthThroughGoogle(req, res));
router.post("/login", logInLimiter, (req, res) => LogIn(req, res));
router.post("/verification", (req, res) => verifController(req, res));

// router.post("/checkCode", (req, res) =>
//   userController.isVerificationCodeCorrect(req, res) Отвал регистрации по моему
// );

router.get("/logout", (req, res) => {
  clearCookie(res);
  res.status(200).json({ success: true, message: "Logged out" });
});
router.get("/loginbyid/:id", (req, res) => GetUserById(req, res));
router.get("/cookie", (req, res) => verifyJWT(req, res));

router.put("/update/:id", updateLimiter, (req, res) =>
  ChangeUserName(req, res)
);
// router.put("/changePassword", (req, res) =>
//   userController.changePassword(req, res)
// );
router.put("/promocode", (req, res) => ActivatePromocode(req, res));

// router.delete("/user/:id", (req, res) => userController.deleteUser(req, res));

export default router;
