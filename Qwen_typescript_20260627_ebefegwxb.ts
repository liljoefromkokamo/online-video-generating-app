// Add these new state variables inside the component:
const [motionBucket, setMotionBucket] = useState(127)
const [fps, setFps] = useState(6)

// Update the handleGenerate function to check credits and send new params:
const handleGenerate = async () => {
  if (!prompt.trim()) return toast.error('Please enter a prompt')
  
  // Check credits (Assuming you pass user credits as a prop or fetch it)
  // if (userCredits <= 0) return toast.error('Out of credits! Please buy more.')

  setIsGenerating(true)
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        duration,
        motionBucket, // NEW
        fps,          // NEW
      }),
    })
    // ... rest of the logic