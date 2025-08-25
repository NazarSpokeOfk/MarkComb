import { Router } from "express";
const router = new Router();

import { logInLimiter, registerLimiter, updateLimiter } from "./limiters.js";

import verifController from "../../controllers/emailRelatedControllers/verifController.js";
import UserController from "../../controllers/userRelatedControllers/userController.js";
import googleAuthController from "../../controllers/googleRelatedControllers/googleAuthController.js";
import verifyJWT from "../../cookies/verifyJWT.js";
import clearCookie from "../../cookies/clearCookies.js";

const userController = new UserController();

router.post("/Uses/:id", (req, res) => userController.addUses(req, res));
router.post("/user", registerLimiter, (req, res) =>
  userController.SignIn(req, res)
);
router.post("/auth/google", (req, res) => googleAuthController(req, res));
router.post("/login", logInLimiter, (req, res) =>
  userController.logIn(req, res)
);
router.post("/verification", (req, res) => verifController(req, res));
router.post("/checkCode", (req, res) =>
  userController.isVerificationCodeCorrect(req, res)
);

router.get("/logout", (req, res) => {
  clearCookie(res);
  res.status(200).json({ success: true, message: "Logged out" });
});

router.get("/loginbyid/:id", (req, res) =>
  userController.getUserByUserId(req, res)
);
router.get("/cookie", (req, res) => verifyJWT(req, res));
router.get("/users", (req, res) => userController.getAllUsers(req, res));

router.put("/update/:id", updateLimiter, (req, res) =>
  userController.updateUser(req, res)
);
router.put("/changePassword", (req, res) =>
  userController.changePassword(req, res)
);
router.put("/promocode", (req, res) =>
  userController.activatePromocode(req, res)
);

router.delete("/user/:id", (req, res) => userController.deleteUser(req, res));

export default router;
