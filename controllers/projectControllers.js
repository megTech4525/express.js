const Project = require('../models/project.models');

// Get all projects by client ID
exports.getProjectsByClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const projects = await Project.find({ client: clientId }).populate('client');

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this client' });
    }

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch projects by client',
      error: err.message
    });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  const { name, description, clientId } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      client: clientId,
      createdBy: req.user.id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Project creation failed', error: err.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('client');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

// Get single project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project', error: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
};

// Delete project (admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};
