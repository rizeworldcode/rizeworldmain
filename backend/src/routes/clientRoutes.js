const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.put('/:id/tasks', clientController.updateClientTasks);
router.put('/:id/renew', clientController.renewClientPackage);

module.exports = router;
