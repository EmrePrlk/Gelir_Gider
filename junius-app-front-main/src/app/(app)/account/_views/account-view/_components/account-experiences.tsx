'use client';

import { type IUserExperience } from 'src/types/user';

import AccountTextSection from './account-text-section';

export type ExperienceCardProps = {
  experiences?: IUserExperience[];
};

export default function AccountExperiences({
  experiences,
}: ExperienceCardProps) {
  if (!experiences) return null;

  const formattedExperiences = experiences.map(experience => ({
    id: experience.id.toString(),
    title: experience.company_name,
    text: `${experience.title_id ?? ''} | ${experience.start_date} - ${experience.end_date || 'Present'} ${experience.description || ''}`,
  }));

  return (
    <AccountTextSection data={formattedExperiences || []} title="Experiences" />
  );
}
