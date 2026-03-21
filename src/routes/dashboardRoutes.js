const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');

// Community dashboard - total stats
router.get('/stats', async (req, res) => {
  try {
    const totalWorkers = await Contribution.countDocuments();
    const stats = await Contribution.aggregate([
      {
        $group: {
          _id: null,
          totalCPU: { $sum: '$cpuDonated' },
          totalTasks: { $sum: '$tasksCompleted' },
          totalUptime: { $sum: '$uptime' }
        }
      }
    ]);

    res.json({
      totalWorkers,
      totalCPUDonated: stats[0]?.totalCPU || 0,
      totalTasksCompleted: stats[0]?.totalTasks || 0,
      totalUptime: stats[0]?.totalUptime || 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Individual worker stats
router.get('/worker/:workerId', async (req, res) => {
  try {
    const worker = await Contribution.findOne({ 
      workerId: req.params.workerId 
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json(worker);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New worker register karo
router.post('/register', async (req, res) => {
  try {
    const { workerId, cpuDonated } = req.body;

    const contribution = new Contribution({
      workerId,
      cpuDonated,
      tasksCompleted: 0,
      uptime: 0
    });

    await contribution.save();

    res.json({ 
      message: '✅ Worker registered!', 
      contribution 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;