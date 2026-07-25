import mongoose from 'mongoose';

// ADDED A UNIFIED USER SCHEMA 
const userSchema = new mongoose.Schema({

    name : { type: String, required: true, trim: true},
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true},
    
})