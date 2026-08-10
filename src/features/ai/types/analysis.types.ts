export type PrescriptionAnalysis = {
  summary: string;
  medecines: MedicineAnalysis[];
  warnings: string[];
  recommendations: string[];
};

export type MedicineAnalysis = {
  name: string;
  purpose: string;
  dosage: string | null;
  precautions: string[];
  sideEffects: string[];
};