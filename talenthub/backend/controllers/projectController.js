const Project = require('../models/Project');
const Application = require('../models/Application');

// ─── GET /api/projects ────────────────────────────────────────────────────────
// Browse all open projects (freelancer). Supports ?search=, ?category=, ?skills=
const getProjects = async (req, res) => {
  try {
    const { search, category, skills, status = 'open', page = 1, limit = 12 } = req.query;

    const query = { status };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (skills) {
      const skillArr = skills.split(',').map((s) => s.trim());
      query.requiredSkills = { $in: skillArr };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('postedBy', 'name email') // uses partner's User model
        .populate('applicationCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query),
    ]);

    res.json({
      projects,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/projects/:id ─────────────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('postedBy', 'name email createdAt')
      .populate('applicationCount');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/projects ────────────────────────────────────────────────────────
// Client creates a project
const createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, budget, category, timeline, experienceLevel, status } = req.body;

    const project = await Project.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      budget,
      category,
      timeline,
      experienceLevel,
      status: status || 'open',
      postedBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── PUT /api/projects/:id ─────────────────────────────────────────────────────
// Client updates their own project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const allowed = ['title', 'description', 'requiredSkills', 'budget', 'category', 'timeline', 'experienceLevel', 'status'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── DELETE /api/projects/:id ──────────────────────────────────────────────────
// Client deletes their own project (also removes all applications)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Application.deleteMany({ projectId: project._id });
    await project.deleteOne();

    res.json({ message: 'Project and related applications deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/projects/my/listings ────────────────────────────────────────────
// Client sees their own projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ postedBy: req.user.id })
      .populate('applicationCount')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject, getMyProjects };