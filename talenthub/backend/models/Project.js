const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    budget: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    timeline: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', ''],
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    // References USERS._id — populated by auth partner's User model
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: application count (populated where needed)
projectSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'projectId',
  count: true,
});

// Text index for search
projectSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });

module.exports = mongoose.model('Project', projectSchema);