const { Worker } = require('bullmq');

const connection = {
  host: 'localhost',
  port: 6379
};

const worker = new Worker('compute-tasks', async (job) => {
  console.log(`⚙️ Processing job: ${job.id}`);
  console.log(`📦 Job Data:`, job.data);

  // Simulate computation (demo ke liye)
  const result = job.data.number * job.data.number;
  console.log(`✅ Result: ${result}`);

  return { result };
}, { connection });

worker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} failed:`, err.message);
});

console.log('👷 Worker is ready and listening...');