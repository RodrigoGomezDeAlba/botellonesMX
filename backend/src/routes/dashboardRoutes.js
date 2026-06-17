const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', [auth, admin], getDashboardStats);

module.exports = router;