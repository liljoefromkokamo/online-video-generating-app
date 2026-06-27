const queueLength = await videoQueue.getWaitingCount()
if (queueLength > 50) {
  return NextResponse.json({ 
    success: true, 
    jobId: job.id, 
    warning: `High traffic! Estimated wait time: ${Math.ceil(queueLength / 3)} minutes.` 
  })
}