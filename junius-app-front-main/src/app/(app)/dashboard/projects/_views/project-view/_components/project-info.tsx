'use client';
import { useMemo } from 'react';

import { fDate } from 'src/utils/format-time';

import InfoCard from 'src/app/(app)/_components/info-card';
import { useProjectStore } from 'src/stores/project-list-store';
import { getProjectStatusIcon } from 'src/definitions/project-status';

export default function ProjectInfo() {
  const [project] = useProjectStore(state => [state.project]);

  const projectInfo = useMemo(
    () => [
      {
        icon: {
          name: 'solar:user-bold',
        },
        label: 'Team Leader',
        value: 'Adam Smith',
      },
      {
        icon: {
          name: 'solar:calendar-bold',
        },
        label: 'Estimated Complete Time',
        value: fDate(project?.estimated_complete_date),
      },
      {
        icon: {
          name: 'solar:lightbulb-bolt-bold',
        },
        label: 'Ideator',
        value: `${project?.idea?.user?.first_name} ${project?.idea?.user?.last_name}`,
      },

      {
        icon: {
          name: getProjectStatusIcon(project?.status!),
        },
        label: 'Current Status',
        value: project?.status ?? 'Draft',
      },
      {
        icon: {
          name: 'solar:phone-bold',
        },
        label: 'Point Of Contact',
        value: '(308) 555-0121 - John Doe',
      },
    ],
    [project],
  );

  return <InfoCard title="Project Info" data={projectInfo} />;
}
