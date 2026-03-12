const Application = require('../models/Application');
const Project = require('../models/Project');

// ─── POST /api/applications ────────────────────────────────────────────────────
// Freelancer submits application
const createApplication = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'open') return res.status(400).json({ message: 'Project is not accepting applications' });

    // Prevent client from applying to their own project
    if (project.postedBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot apply to your own project' });
    }

    const existing = await Application.findOne({ projectId, applicantId: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already applied to this project' });

    const application = await Application.create({
      projectId,
      applicantId: req.user.id,
      message,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── GET /api/applications/my ──────────────────────────────────────────────────
// Freelancer sees all their applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user.id })
      .populate('projectId', 'title status budget category postedBy')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/applications/project/:projectId ─────────────────────────────────
// Client sees all applicants for their project
const getProjectApplications = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ projectId: req.params.projectId })
      .populate('applicantId', 'name email skills bio') // uses partner's User model
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE /api/applications/:id ─────────────────────────────────────────────
// Freelancer withdraws their application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.applicantId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await application.deleteOne();
    res.json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PATCH /api/applications/:id/status ───────────────────────────────────────
// Client updates application status (reviewed / accepted / rejected)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('projectId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.projectId.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getProjectApplications,
  deleteApplication,
  updateApplicationStatus,
};