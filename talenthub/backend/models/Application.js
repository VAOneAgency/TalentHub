const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // appliedAt = createdAt
  }
);

// One application per freelancer per project
applicationSchema.index({ projectId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);