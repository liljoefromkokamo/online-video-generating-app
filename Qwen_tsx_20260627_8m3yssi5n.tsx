{/* Advanced Settings */}
<div className="mb-8 p-4 bg-slate-950/30 rounded-xl border border-slate-800">
  <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
    <Settings className="w-4 h-4" /> Advanced Settings
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-xs text-slate-500 mb-2">
        Motion Intensity (Bucket): {motionBucket}
      </label>
      <input
        type="range" min="1" max="255" value={motionBucket}
        onChange={(e) => setMotionBucket(Number(e.target.value))}
        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
      />
    </div>
    <div>
      <label className="block text-xs text-slate-500 mb-2">
        Frames Per Second: {fps}
      </label>
      <input
        type="range" min="6" max="24" step="2" value={fps}
        onChange={(e) => setFps(Number(e.target.value))}
        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  </div>
</div>