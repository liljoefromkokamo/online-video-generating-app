import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { videoQueue } from "@/lib/queue"

export async function POST(req: Request) {
  const { prompt, aspectRatio, duration, userId } = await req.json()

  // 1. Calculate Cost (e.g., 5s = 1 credit, 10s = 2 credits)
  const creditsUsed = Math.ceil(duration / 5)

  // 2. Create DB Record
  const job = await prisma.videoJob.create({
    data: { userId, prompt, aspectRatio, duration, creditsUsed },
  })

  // 3. Add to Queue
  await videoQueue.add("generate-video", {
    jobId: job.id,
    prompt,
    aspectRatio,
    duration,
  })

  return NextResponse.json({ success: true, jobId: job.id })
}