import mongoose from 'mongoose';

const adminschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    taskrequest: [
        {
            userId: { type: mongoose.Types.ObjectId, ref: "User" },
            task: { type: String },
            status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        },
    ],
    taskaccepted: [
        {
            userId: { type: mongoose.Types.ObjectId, ref: "User" },
            task: { type: String },
        },
    ],

},{timestamps:true});

const Admin= mongoose.model('Admin',adminschema);
export default Admin;