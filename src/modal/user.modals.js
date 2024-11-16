import mongoose, { Schema } from "mongoose";

const userschema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    task:{
        type:String,
    },
    assignRequest: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Admin",
        },
    ],
    assignedto:{
        type:mongoose.Types.ObjectId,
        ref:"Admin",
    }

},{timestamps:true});

const User = mongoose.model('User',userschema);

export default User;
