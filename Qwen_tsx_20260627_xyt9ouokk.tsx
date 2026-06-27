"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2, Zap } from "lucide-react"

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const creditsCost = Math.ceil(duration / 5)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)

    // 1. Start Generation
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, duration, userId: "user_123" }), // Replace with real Auth
    })
    const { jobId } = await res.json()

    // 2. Connect to SSE Stream
    const eventSource = new EventSource(`/api/stream/${jobId}`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.progress) setProgress(data.progress)
      
      if (data.status === "COMPLETED" || data.status === "FAILED") {
        eventSource.close()
        setIsGenerating(false)
        // Trigger a refresh or update UI state here
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-purple-500" /> Create New Video
        </h2>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cyberpunk city in the rain, neon lights reflecting on wet streets, cinematic 4k..."
          className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none mb-6"
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <label className="text-sm text-slate-400">Duration</label>
            <input 
              type="range" min="5" max="15" step="5" value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-48 accent-purple-500"
            />
            <span className="ml-2 text-white font-mono">{duration}s</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold">{creditsCost} Credits</span>
          </div>
        </div>

        {isGenerating && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Generating...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? "Processing in Queue..." : "Generate Video"}
        </button>
      </div>
    </div>
  )
}