import { z } from "zod" 

export const registerzodSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string().min(8)
})


export const loginzodSchema = z.object({
  email: z.email("Valid email daalo"),
  password: z.string().min(8, "Password kam az kam 8 characters ka hona chahiye")
})