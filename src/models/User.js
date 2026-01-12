import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true, maxlength: 50 },
    roleId: { type: String, required: true },
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    password: { type: String, required: true, minlength: 8 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, isDeleted: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
