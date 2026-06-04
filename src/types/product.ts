export type VerificationCriterion = {
  label: string;
  score: number;
  note: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  verificationScore: number;
  certificationStatus: string;
  registeredAt: string;
  verificationReport: {
    criteria: VerificationCriterion[];
    certificationLabel: string;
  };
};
