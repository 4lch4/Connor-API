import { z } from 'zod'

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
  admin: z
    .boolean({ description: 'Whether or not to login as an admin user.' })
    .optional()
    .default(false),
})
