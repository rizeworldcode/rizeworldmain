const express = require('express');
const router = express.Router();
const {
  createOldClient,
  getAllOldClients,
  getOldClient,
  updateOldClient,
  deleteOldClient
} = require('../controllers/oldClientController');

router.route('/')
  .post(createOldClient)
  .get(getAllOldClients);

router.route('/:id')
  .get(getOldClient)
  .put(updateOldClient)
  .delete(deleteOldClient);

module.exports = router;
