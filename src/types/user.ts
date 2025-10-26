import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const userStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const userRecordSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable().optional(),
  role: z.string().nullable().optional(),
  status: userStatusSchema.default('pending'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserRecord = z.infer<typeof userRecordSchema>;

export function normalizeTimestamp(value?: Timestamp | Date | null) {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toDate();
  return value;
}

