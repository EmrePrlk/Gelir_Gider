'use client';

import { useDefinitionStore } from 'src/stores/definition-store';

import { type IProject } from 'src/types/project';

import AccountTextSection from './account-text-section';

export type ProjectCardProps = {
  projects?: IProject[];
};

export default function AccountProjects({ projects }: ProjectCardProps) {
  const [getPreferedTitleById] = useDefinitionStore(state => [
    state.getPreferedTitleById,
  ]);

  if (!projects) return null;

  const formattedProjects = projects.map(project => {
    const staff = getPreferedTitleById(
      project.staff_role_id?.toString() ?? '-1',
    );
    return {
      id: project.id.toString(),
      title: `${project.title} - ${staff?.title}`,
      text: `${project.summary}`,
    };
  });

  return <AccountTextSection data={formattedProjects || []} title="Projects" />;
}
