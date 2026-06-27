'use client'

import { Video } from '@prisma/client'
import { Download, Share2, Play, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface VideoGalleryProps {
  videos: Video[]
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const handleDownload = async (videoUrl: string, videoId: string) => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-video-${videoId}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Video downloaded!')
    } catch (error) {
      toast.error('Failed to download video')
    }
  }

  const handleShare = (videoId: string) => {
    const url = `${window.location.origin}/video/${videoId}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p className="text-lg">No videos generated yet. Create your first masterpiece!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden group hover:border-purple-500/50 transition-all">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {video.status === 'COMPLETED' ? (
              <video 
                src={video.videoUrl!} 
                controls 
                className="w-full h-full object-cover"
              />
            ) : video.status === 'PROCESSING' || video.status === 'PENDING' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Generating...</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-red-950/20">
                <p className="text-red-400 text-sm">Generation Failed</p>
              </div>
            )}
          </div>

          {/* Info & Actions */}
          <div className="p-4">
            <p className="text-sm text-slate-300 line-clamp-2 mb-4 h-10">{video.prompt}</p>
            
            {video.status === 'COMPLETED' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(video.videoUrl!, video.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button 
                  onClick={() => handleShare(video.id)}
                  className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}