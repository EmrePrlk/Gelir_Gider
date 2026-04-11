export type EducationLevel = {
  id: number;
  title: string;
  value: string;
};

export const EducationLevels: EducationLevel[] = [
  { id: 1, title: 'High School', value: 'high_school' },
  { id: 2, title: "Bachelor's Degree", value: 'bachelors' },
  { id: 3, title: "Master's Degree", value: 'masters' },
  { id: 4, title: 'PhD', value: 'phd' },
  { id: 5, title: 'Other', value: 'other' },
];
