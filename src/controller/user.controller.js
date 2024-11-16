import User from "../modal/user.modals.js";
import mongoose from 'mongoose';
import { generateToken } from "../utils/jwt.js";
import { userLoginValidator ,userRegistrationValidator, validateUploadTask} from "../validators/userValidator.js";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Admin from "../modal/admin.modals.js";
export const login= async(req,res)=>{
    // Valedating the inputs
    await Promise.all(userLoginValidator.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    const {email, password}=req.body;

    try{
        const user= await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=generateToken(user);
        return res.status(200).json({
            message:"Login Successfull",
            token:token,
            data:{
                Username:user.username,
                email:user.email,
            }
        })
    }
    catch(err){
        console.error(err);
        res.status(500).send({message:"Server Error",error:err.message});
    }
}
export const register= async(req,res)=>{
    // Valedating the inputs
    await Promise.all(userRegistrationValidator.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    const {username,email,password}= req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            return res.status(409).json({message:'User already exist with this email'})
        }
        const hasedpassword= await bcrypt.hash(password,10);

        const newuser =new User({
            username,
            email,
            password:hasedpassword
        });
        await newuser.save();
        return res.status(201).json({message:'User Registerd successfully!',data:{
            username:newuser.username,
            email:newuser.email
        }})
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error",error:err.message});
    }
}

export const getalladmin = async(req,res)=>{
    try{
        const admins = await Admin.find().select('username email -_id');
        if(admins.lenght === 0){
            return res.status(404).json({message:'No Admin found'})
        }
        return res.status(200).json({message:'Adims Fetch Sucesfully',Admins:admins});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:'Server error',error:err.message});
    }
}

export const uploadtask= async(req,res)=>{
    await Promise.all(validateUploadTask.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Validation errors", errors: errors.array() });
        }

        const userId = req.user;
        const { task, adminName } = req.body;
        try {
            const admin = await Admin.findOne({ username: adminName });
            const user = await User.findById(userId);
    
            if (!admin) {
                return res.status(404).json({ message: `Admin not found with name ${adminName}`});
            }
    
            
            const taskRequest = {
                userId: userId,
                task: task,
                status: "pending"
            };
    
            // Add task to Admin's taskrequest
            admin.taskrequest.push(taskRequest);
            await admin.save();
    
            // Add Admin's ID to User's assignRequest array if not already present
            if (!user.assignRequest.includes(admin._id)) {
                user.assignRequest.push(admin._id);
            }
            await user.save();
    
            return res.status(200).json({ message: 'Task assigned successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
}
