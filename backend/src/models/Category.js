// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // null = system/default
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);