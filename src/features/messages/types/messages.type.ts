import { PrescriptionAnalysis } from 'src/features/ai/types/analysis.types';

export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export type ContentType = string | PrescriptionAnalysis;
