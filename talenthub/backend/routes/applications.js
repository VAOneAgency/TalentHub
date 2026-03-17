const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  createApplication,
  getMyApplications,
  getProjectApplications,
  deleteApplication,
  updateApplicationStatus,
} = require('../controllers/applicationController');

// All application routes require auth
router.use(protect);

// Freelancer routes
router.post('/', requireRole('freelancer'), createApplication);
router.get('/my', requireRole('freelancer'), getMyApplications);
router.delete('/:id', requireRole('freelancer'), deleteApplication);

// Client routes
router.get('/project/:projectId', requireRole('client'), getProjectApplications);
router.patch('/:id/status', requireRole('client'), updateApplicationStatus);

// GET /api/applications/check/:projectId
router.get('/check/:projectId', protect, async (req, res) => {
  try {
    const existing = await Application.findOne({
      projectId: req.params.projectId,
      applicantId: req.user._id,
    });
    res.json({ hasApplied: !!existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;