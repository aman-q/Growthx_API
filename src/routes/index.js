import express from 'express';
import userRouter from './user.router.js';
import adminRoutes from './admin.router.js';

const route= express.Router();

route.use('/user',userRouter);
route.use('/admin',adminRoutes)


export default route;