/* eslint-disable react/no-children-prop */
import { Card, CardHeader, CardContent } from '@mui/material';

import { useProjectStore } from 'src/stores/project-list-store';

import Markdown from 'src/components/markdown';

export default function ProjectDetail() {
  const [project] = useProjectStore(state => [state.project]);

  return (
    <Card>
      <CardHeader title="Project Details" />
      <CardContent>
        <Markdown children={project?.detail ?? ''} />
      </CardContent>
    </Card>
  );
}
