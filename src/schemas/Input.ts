import { z } from 'zod'

export const AskInputSchema = z.object({
  history: z.array(z.string()),
  prompt: z.string(),
})
