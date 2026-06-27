import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateVideo } from '@/lib/replicate'
import { auth } from '@/lib/auth' // You'll need to implement auth

export async function POST(req: Request) {
  try {
    // const session = await auth() // Uncomment when auth is set up
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { prompt, aspectRatio, duration } = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        prompt,
        aspectRatio,
        duration,
        status: 'PENDING',
        userId: 'user_123', // Replace with actual user ID from session
      },
    })

    // Start generation in background
    generateVideoAndSave(video.id, prompt, aspectRatio, duration)

    return NextResponse.json({
      success: true,
      videoId: video.id,
      message: 'Video generation started',
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to start generation' },
      { status: 500 }
    )
  }
}

async function generateVideoAndSave(
  videoId: string,
  prompt: string,
  aspectRatio: string,
  duration: number
) {
  try {
    // Update status to processing
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'PROCESSING' },
    })

    // Generate video
    const output = await generateVideo({ prompt, aspectRatio, duration })

    // Update with video URL
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'COMPLETED',
        videoUrl: output,
        replicateId: videoId,
      },
    })
  } catch (error) {
    console.error('Background generation error:', error)
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'FAILED' },
    })
  }
}

// GET endpoint to check status
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const videoId = searchParams.get('id')

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
  }

  const video = await prisma.video.findUnique({
    where: { id: videoId },
  })

  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }

  return NextResponse.json(video)
}