import mongoose from 'mongoose';

// ADDED A UNIFIED USER SCHEMA 
const userSchema = new mongoose.Schema({

    name : { type: String, required: true, trim: true},
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true},
    
    
    accountType: {
        type: String,
        enum: ['b2c', 'b2b'],
        default: 'b2c'
    },
    organizationId: {
        type: String,
        enum: ['mentee', 'mentor', 'hr_admin', 'super_admin'],
        default: 'mentee'
    },

    // matching profile data 
    profile: {
        bio: {
            type: String, maxLength: 500
        },
        skills: {type:  String, trim: true },
        goals: { type: String, trim: true },
    },

    // mentorPrefernces // if role === mentor
    mentorPrefernces: {
        isAvailable: { type: Boolean, default: false },
        maxMentees: { type: Number, default: 3 },
        topics: [{ type: String }]
    }
}, { timestamps: true });

// Indexing for performance
// In order to make searching for mentors under specific enterprise fast
userSchema.index({ organizationId: 1, role: 1 });
userSchema.index({ email: 1});

const User = mongoose.models.users || mongoose.model('User', userSchema);

export default User;

