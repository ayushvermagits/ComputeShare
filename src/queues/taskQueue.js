const { Queue } = require('bullmq');

const connection = {
  host: 'localhost',
  port: 6379
};

const taskQueue = new Queue('compute-tasks', { connection });

console.log('✅ Task Queue Ready');

module.exports = taskQueue;