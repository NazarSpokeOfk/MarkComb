import { Router } from "express";
const router = new Router();

import {
  logInLimiter,
  registerLimiter,
  updateLimiter,
  changePasswordLimiter,
} from "./limiters/userRouterLimiters.js";

import verifyJWT from "../cookies/verifyJWT.js";
import clearCookie from "../cookies/clearCookies.js";
import {
  AddUses,
  SignIn,
  LogIn,
  GetUserById,
  ChangeUserName,
  ActivatePromocode,
  DeleteUser,
  ChangePassword,
} from "../controllers/userController.js";
import AuthThroughGoogle from "../controllers/googleAuthController.js";

router.post("/Uses/:id", (req, res) => AddUses(req, res));
router.post("/user", registerLimiter, (req, res) => SignIn(req, res));
router.post("/auth/google", (req, res) => AuthThroughGoogle(req, res));
router.post("/login", logInLimiter, (req, res) => LogIn(req, res));

router.get("/logout", (req, res) => {
  clearCookie(res);
  res.status(200).json({ success: true, message: "Logged out" });
});
router.get("/loginbyid/:id", (req, res) => GetUserById(req, res));
router.get("/cookie", (req, res) => verifyJWT(req, res));

router.put("/update/:id", updateLimiter, (req, res) =>
  ChangeUserName(req, res)
);

router.put("/reset", changePasswordLimiter, (req, res) =>
  ChangePassword(req, res)
);

router.put("/promocode", (req, res) => ActivatePromocode(req, res));

router.delete("/delete", (req, res) => DeleteUser(req, res));

export default router;
