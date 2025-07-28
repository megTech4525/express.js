const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientControllers');
const auth = require('../middleware/authMiddleware');

// Validation middleware
const { clientValidation } = require('../middleware/validation/clientValidation');
const validateRequest = require('../middleware/validation/validateRequest');

// Routes
router.post(
  '/',
  auth.protect,
  clientValidation,
  validateRequest,
  clientController.createClient
);

router.get('/', auth.protect, clientController.getClients);
router.get('/:id', auth.protect, clientController.getClient);
router.put('/:id', auth.protect, clientController.updateClient);
router.delete('/:id', auth.protect, auth.admin, clientController.deleteClient);

module.exports = router;
