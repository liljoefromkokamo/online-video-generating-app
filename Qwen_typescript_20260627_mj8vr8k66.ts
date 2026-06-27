import { replicate } from "./replicate"

export async function enhancePrompt(userPrompt: string): Promise<string> {
  const systemPrompt = "You are an expert AI video prompt engineer. Expand the user's short prompt into a highly detailed, cinematic video generation prompt. Include camera angles, lighting, and motion details. Output ONLY the enhanced prompt."
  
  const output = await replicate.run("meta/meta-llama-3-8b-instruct", {
    input: {
      prompt: `${systemPrompt}\n\nUser prompt: ${userPrompt}`,
      max_new_tokens: 150,
    }
  })
  
  return (output as string[]).join("")
}