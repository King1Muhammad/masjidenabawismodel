import { z } from 'zod';

export const insertMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof insertMessageSchema>; 