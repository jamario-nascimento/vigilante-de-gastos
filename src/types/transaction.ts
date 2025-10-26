import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const transactionTypeSchema = z.enum(['expense', 'income']);

export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: transactionTypeSchema,
  amount: z.number().nonnegative(),
  categoryId: z.string(),
  description: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  date: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export function toDate(value?: Timestamp | Date | null) {
  if (!value) return undefined;
  return value instanceof Timestamp ? value.toDate() : value;
}

