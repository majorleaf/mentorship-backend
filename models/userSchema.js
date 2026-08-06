import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['mentee', 'mentor', 'hr_admin', 'super_admin'],
    default: 'mentee',
  },

  accountType: {
    type: String,
    enum: ['b2c', 'b2b'],
    default: 'b2c',
  },

  // Reference to an Organization document (only for b2b users)
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
  },

  // Matching profile data
  profile: {
    bio: { type: String, maxLength: 500 },
    skills: { type: String, trim: true },
    goals: { type: String, trim: true },
    title: { type: String, trim: true },        // e.g. "Senior SWE at Google"
    expertise: [{ type: String }],              // for mentor cards
    rating: { type: Number, default: 0 },       // mentor rating
    sessionsCount: { type: Number, default: 0 },// total sessions completed
  },

  // Mentee stats (used by dashboard)
  aiChats: { type: Number, default: 0 },
  sessionsBooked: { type: Number, default: 0 },
  milestones: { type: Number, default: 0 },
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Mentor-only preferences
  mentorPreferences: {
    isAvailable: { type: Boolean, default: false },
    maxMentees: { type: Number, default: 3 },
    topics: [{ type: String }],
  },

}, { timestamps: true });

// Index for fast org + role queries (B2B team views)
userSchema.index({ organizationId: 1, role: 1 });

const User = mongoose.models.users || mongoose.model('User', userSchema);

export default User;