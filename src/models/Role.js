import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
