import { validationResult } from "express-validator";
import Admin from "../modal/admin.modals.js";
import mongoose from "mongoose";
import { generateToken } from "../utils/jwt.js";
import { userLoginValidator, userRegistrationValidator } from "../validators/userValidator.js";
import bcrypt from 'bcrypt';
export const login= async(req,res)=>{
    // Valedating the inputs
    await Promise.all(userLoginValidator.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, errors: errors.array() });
    }
    const {email, password}=req.body;

    try{
        const user= await Admin.findOne({email});
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
        const user = await Admin.findOne({email});
        if(user){
            return res.status(409).json({message:'Admin already exist with this email'})
        }
        const hasedpassword= await bcrypt.hash(password,10);

        const newuser =new Admin({
            username,
            email,
            password:hasedpassword
        });
        await newuser.save();
        return res.status(201).json({message:'Admin Registerd successfully!',data:{
            username:newuser.username,
            email:newuser.email
        }})
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error",error:err.message});
    }
}

export const getRequestsForAdmin = async (req, res) => {
    try {
        const adminId = req.user; // From Middleware
        
        // Find the admin 
        const admin = await Admin.findById(adminId).populate('taskrequest.userId', 'username ');

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Format the response to include user names instead of user IDs
        const formattedRequests = admin.taskrequest.map(request => ({
            taskId: request._id,
            userName: request.userId.username,
            task: request.task,
            status: request.status,
        }));

        return res.status(200).json({
            message: "Task requests fetched successfully",
            data: formattedRequests,
        });
    } catch (err) {
        console.error("Error in getRequestsForAdmin:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const acceptAssignment = async (req, res) => {
    try {
        const adminId = req.user; // Extracted from middleware 
        const { id } = req.params; 

        // Find the admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Locate the task within the admin's taskrequest
        const taskIndex = admin.taskrequest.findIndex(
            (task) => task._id.toString() === id && task.status === "pending"
        );
        if (taskIndex === -1) {
            return res.status(404).json({ message: "Pending task not found" });
        }
        // Move task to taskaccepted
        const acceptedTask = admin.taskrequest[taskIndex];
        acceptedTask.status = "accepted";
        admin.taskaccepted.push(acceptedTask);

        // Remove from taskrequest
        admin.taskrequest.splice(taskIndex, 1);

        await admin.save();

        return res.status(200).json({
            message: "Task accepted successfully",
            data: acceptedTask,
        });
    } catch (err) {
        console.error("Error in acceptAssignment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const rejectAssignment = async (req, res) => {
    try {
        // From Middleware
        const adminId = req.user; 
        const { id } = req.params;

        // Find the admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Locate the task within the admin's taskrequest
        const taskIndex = admin.taskrequest.findIndex(
            (task) => task._id.toString() === id && task.status === "pending"
        );
        if (taskIndex === -1) {
            return res.status(404).json({ message: "Pending task not found" });
        }

        // Update the task status to rejected
        admin.taskrequest[taskIndex].status = "rejected";

          // Remove from taskrequest
          admin.taskrequest.splice(taskIndex, 1);

        await admin.save();

        return res.status(200).json({
            message: "Task rejected successfully",
            data: admin.taskrequest[taskIndex],
        });
    } catch (err) {
        console.error("Error in rejectAssignment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
