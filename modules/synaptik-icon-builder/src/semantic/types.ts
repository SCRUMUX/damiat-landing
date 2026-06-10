import { z } from 'zod';

export const IconTypeSchema = z.enum([
  'object',
  'process',
  'business',
  'infrastructure',
  'analytics',
]);

export type IconType = z.infer<typeof IconTypeSchema>;

export const CardSemanticSchema = z.object({
  cardId: z.string(),
  iconType: IconTypeSchema,
  visualObject: z.string().min(8),
  visualFocus: z.array(z.string()).min(1).max(4),
  generatedAt: z.string().datetime().optional(),
});

export type CardSemantic = z.infer<typeof CardSemanticSchema>;
