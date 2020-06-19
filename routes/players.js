const express = require('express');
const {
  createPlayer,
  getPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
} = require('../controllers/playersController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Player = require('../models/Player');

const ordersRouter = require('./orders');
const reportsRouter = require('./reports');

const router = express.Router({ mergeParams: true });

router.use('/:playerId/orders', protect, ordersRouter);
router.use('/:playerId/reports', protect, reportsRouter);

router.post('/', protect, createPlayer);
router.get(
  '/',
  [protect, advancedResults(Player, [{ path: 'club', select: 'name' }])],
  getPlayers
);
router.get('/:id', protect, getPlayer);
router.put('/:id', protect, updatePlayer);
router.delete('/:id', [protect, authorize('admin')], deletePlayer);

module.exports = router;
