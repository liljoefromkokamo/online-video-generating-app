import { Queue } from 'bullmq'
import Redis from 'ioredis'

export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
})

export const videoQueue = new Queue('video-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 500,
  },
})