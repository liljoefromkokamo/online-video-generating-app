import Replicate from 'replicate'

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function generateVideo({
  prompt,
  aspectRatio = '16:9',
  duration = 5,
}: {
  prompt: string
  aspectRatio: string
  duration: number
}) {
  try {
    // Using Stable Video Diffusion or another model on Replicate
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816f3af3d2319f5e8c9e8e8e8e8e8e8e8e8e8",
      {
        input: {
          prompt: prompt,
          video_length: duration === 5 ? "25_frames_with_svd_xt" : "14_frames_with_svd",
          sizing_strategy: aspectRatio === '16:9' ? 'maintain_aspect_ratio' : 'custom',
          motion_bucket_id: 127,
          frames_per_second: 6,
        },
      }
    )

    return output
  } catch (error) {
    console.error('Error generating video:', error)
    throw error
  }
}