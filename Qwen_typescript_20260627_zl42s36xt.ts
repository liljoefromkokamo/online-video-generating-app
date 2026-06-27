import Replicate from "replicate"

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Using Minimax Video-01 (Excellent Text-to-Video)
export const VIDEO_MODEL = "minimax/video-01-live" 