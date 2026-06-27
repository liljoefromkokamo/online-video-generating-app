import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs" // Required for SSE in Next.js

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  const { jobId } = params

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      const interval = setInterval(async () => {
        const job = await prisma.videoJob.findUnique({ where: { id: jobId } })
        
        if (!job) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Not found" })}\n\n`))
          controller.close()
          return
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(job)}\n\n`))

        if (job.status === "COMPLETED" || job.status === "FAILED") {
          clearInterval(interval)
          controller.close()
        }
      }, 1000) // Poll DB every 1 second and push to client

      req.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}