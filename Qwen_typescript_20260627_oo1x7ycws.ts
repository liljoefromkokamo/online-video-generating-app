'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Video } from 'lucide-react'
import { toast } from 'sonner'

interface VideoGeneratorProps {
  // Add props if needed
}

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setCurrentVideoId(data.videoId)
      toast.success('Video generation started!')
      
      // Poll for completion
      pollVideoStatus(data.videoId)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate video')
    } finally {
      setIsGenerating(false)
    }
  }

  const pollVideoStatus = async (videoId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate?id=${videoId}`)
        const video = await response.json()

        if (video.status === 'COMPLETED') {
          clearInterval(interval)
          toast.success('Video generated successfully!')
          // Reload or update UI
          window.location.reload()
        } else if (video.status === 'FAILED') {
          clearInterval(interval)
          toast.error('Video generation failed')
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000) // Check every 3 seconds
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Text-to-Video AI Generator
          </h1>
          <p className="text-slate-400 text-lg">
            Transform your ideas into stunning videos with AI
          </p>
        </motion.div>

        {/* Main Generator Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 shadow-2xl"
        >
          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter your creative prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk city in the rain, neon lights reflecting on wet streets, cinematic 4k..."
              className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="21:9">21:9 (Ultrawide)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration: {duration}s
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3s</span>
                <span>10s</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold py-5 px-8 rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Video
              </>
            )}
          </motion.button>

          {/* Credits Info */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Each generation costs 1 credit • You have 10 credits remaining</p>
          </div>
        </motion.div>

        {/* Example Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-slate-300 mb-4">
            Try these examples:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'A serene Japanese garden with cherry blossoms falling in slow motion',
              'Futuristic spaceship flying through a nebula, cinematic lighting',
              'A majestic dragon breathing fire over a medieval castle at sunset',
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-4 bg-slate-900/30 border border-slate-800 rounded-xl hover:border-purple-500/50 hover:bg-slate-900/50 transition-all text-sm text-slate-400 hover:text-slate-300"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}