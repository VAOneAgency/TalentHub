const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
} = require('../controllers/projectController');

// Public
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Client only
router.use(protect);
router.get('/my/listings', requireRole('client'), getMyProjects);
router.post('/', requireRole('client'), createProject);
router.put('/:id', requireRole('client'), updateProject);
router.delete('/:id', requireRole('client'), deleteProject);

module.exports = router;