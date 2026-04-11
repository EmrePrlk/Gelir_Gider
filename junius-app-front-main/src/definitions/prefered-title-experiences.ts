export type PreferedTitleExperience = {
  id: string;
  title: string;
  value: string;
};

export const PreferedTitleExperiences: PreferedTitleExperience[] = [
  { id: '1', title: 'No experience', value: 'no_experience' },
  { id: '2', title: '0-2 years', value: 'entry_level' },
  { id: '3', title: '3-5 years', value: 'mid_level' },
  { id: '4', title: '6+ years', value: 'senior_level' },
  { id: '5', title: '10+ years', value: 'executive_level' },
];
