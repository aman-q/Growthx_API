import express from 'express';
import { login,register,getalladmin, uploadtask} from '../controller/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { loginRateLimiter, checkIPBlocked,registerRateLimiter} from '../middleware/rateLimiter.middleware.js';

const userRouter =express.Router();

//Login
userRouter.post('/user-login',checkIPBlocked,loginRateLimiter,login);

//Register 
userRouter.post('/user-register',checkIPBlocked,registerRateLimiter,register);

//Get All Admin Names
userRouter.get('/get-all-admin-names',authMiddleware, getalladmin);

//Upload Task
userRouter.post('/upload-task',authMiddleware,uploadtask);



export default userRouter;

