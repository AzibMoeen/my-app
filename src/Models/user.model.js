import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  clerkId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,

    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the model, or create it if it doesn't exist (to prevent re-compiling in dev mode)
export default mongoose.models.User || mongoose.model('User', userSchema);

