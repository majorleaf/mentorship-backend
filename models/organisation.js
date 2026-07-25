import mongoose from 'mongoose';

// The Organizaation schema (The B2B SaaS Layer)

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        unique: true,
        sparse: true,
        lowerCase: true,
        trim: true
    },
    subscriptionPlan: {
        type: String,
        enum: ['trial', 'pro', 'enterprise'],
        default: 'trial'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;