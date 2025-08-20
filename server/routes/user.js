import { Router } from "express";
import { getFriends, login, register, updateProfilePicture, updateUser } from "../controllers/user.js";
import { authorizationCheck } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const userRouter= Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post("/updateprofile",authorizationCheck, updateUser)
userRouter.post("/updateprofilepicture",[authorizationCheck,upload.single("profilePicture")], updateProfilePicture)

userRouter.get('/', getFriends);



export default userRouter;

