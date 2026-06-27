import { Worker } from "bullmq"
import { redisConnection } from "@/lib/queue"
import { prisma } from "@/lib/prisma"
import { replicate, VIDEO_MODEL } from "@/lib/replicate"
import { downloadAndUploadToS3 } from "@/lib/s3"

const worker = new Worker("video-generation", async (job) => {
  const { jobId, prompt, aspectRatio, duration } = job.data

  try {
    await prisma.videoJob.update({ where: { id: jobId }, data: { status: "PROCESSING", progress: 10 } })

    // Call Replicate API
    const output = await replicate.run(VIDEO_MODEL, {
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        duration: duration,
      }
    })

    await prisma.videoJob.update({ where: { id: jobId }, data: { progress: 80 } })

    // Replicate returns a URL. Download it and upload to our S3.
    const s3Url = await downloadAndUploadToS3(output as string, jobId)

    await prisma.videoJob.update({
      where: { id: jobId },
      data: { status: "COMPLETED", progress: 100, videoUrl: s3Url },
    })

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error)
    await prisma.videoJob.update({
      where: { id: jobId },
      data: { status: "FAILED", progress: 0 },
    })
  }
}, { connection: redisConnection, concurrency: 3 }) // Process 3 videos concurrently

console.log("Worker started and listening for jobs...")