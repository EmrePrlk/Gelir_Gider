import { Stack } from '@mui/material';

import ProjectInfo from './project-info';
import ProjectNotes from './project-notes';
import ProjectSocial from './project-social';
import ProjectDetail from './project-detail';
import ProjectIdeaDoc from './project-idea-doc';
import ProjectTeam from './project-team';
import ProjectBurndownChart from './project-burndown-chart';
import ProjectPieChartPublic from './project-pie-chart-public';
import ProjectPieChartPrivate from './project-pie-chart-private';
import ProjectTargetInvestment from './project-target-investment';

export default function ProjectBody() {
  return (
    <Stack spacing={2} sx={{ mt: 4 }}>
      {/* TODO: Connect project social to the backend */}
      <ProjectSocial />
      <ProjectTeam />
      {/* TODO: Connect project info to the backend, only for the: team_leader, and the point_of_contact */}
      <ProjectInfo />
      {/* TODO: Connect project burndown chart to the backend */}
      <ProjectBurndownChart title="Project Burndown (October 2024)" />
      {/* TODO: Connect project pie chart private to the backend */}
      <ProjectPieChartPrivate title="Project Project Shares Distribution (Private)" />
      {/* TODO: Connect project pie chart public to the backend */}
      <ProjectPieChartPublic title="Project Project Shares Distribution (Public)" />
      {/* TODO: Connect project target investment to the backend, only for the current_investment_amount */}
      <ProjectTargetInvestment />
      <ProjectDetail />
      {/* TODO: For now we are currently using only the first idea doc, but we should be able to add more documents to the project */}
      <ProjectIdeaDoc />
      {/* TODO: Connect project notes to the backend */}
      <ProjectNotes />
    </Stack>
  );
}
