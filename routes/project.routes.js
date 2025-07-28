const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectControllers');
const auth = require('../middleware/authMiddleware');

// Validation middleware
const { projectValidation } = require('../middleware/validation/projectValidation');
const validateRequest = require('../middleware/validation/validateRequest');

// Routes
router.post(
  '/',
  auth.protect,
  projectValidation,
  validateRequest,
  projectController.createProject
);

router.get('/', auth.protect, projectController.getProjects);

router.get(
  '/client/:clientId',
  auth.protect,
  projectController.getProjectsByClient // ✅ fetch by client
);

router.get('/:id', auth.protect, projectController.getProject);

router.put('/:id', auth.protect, projectController.updateProject);

router.delete('/:id', auth.protect, auth.admin, projectController.deleteProject);

module.exports = router;
