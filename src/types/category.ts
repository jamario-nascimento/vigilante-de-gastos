import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: z.enum(['expense', 'income']),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export function toDate(value?: Timestamp | Date | null) {
  if (!value) return undefined;
  return value instanceof Timestamp ? value.toDate() : value;
}

