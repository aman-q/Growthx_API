import express from 'express';
import {login , register,getRequestsForAdmin,acceptAssignment,rejectAssignment} from '../controller/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { loginRateLimiter, checkIPBlocked,registerRateLimiter} from '../middleware/rateLimiter.middleware.js';
const adminRoutes= express.Router();

//login
adminRoutes.post('/admin-login',checkIPBlocked,loginRateLimiter,login);

//Register
adminRoutes.post('/admin-register',checkIPBlocked,registerRateLimiter,register);

// Get All Request of Admin
adminRoutes.get('/getRequests',authMiddleware, getRequestsForAdmin);

// Accept the Task
adminRoutes.put('/accept/:id',authMiddleware,acceptAssignment);

// Reject the task 
adminRoutes.put('/reject/:id',authMiddleware, rejectAssignment);


export default adminRoutes;