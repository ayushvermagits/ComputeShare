const express = require('express');
const router = express.Router();
const taskQueue = require('../queues/taskQueue');

// Task submit karne ka route
router.post('/submit', async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ error: 'number field required' });
    }

    const job = await taskQueue.add('compute', { number });

    res.json({
      message: '✅ Task submitted!',
      jobId: job.id,
      data: { number }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Job status check karne ka route
router.get('/status/:jobId', async (req, res) => {
  try {
    const job = await taskQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    res.json({
      jobId: job.id,
      state,
      data: job.data,
      result: job.returnvalue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;