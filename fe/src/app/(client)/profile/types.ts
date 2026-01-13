import { z } from 'zod';
import { updateUserBodySchema } from '@/lib/schemas/user.schema';

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

