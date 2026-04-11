import { Card, CardHeader, CardContent } from '@mui/material';

import ListSection from 'src/app/(app)/_components/list-section';

export default function ProjectNotes() {
  return (
    <Card>
      <CardHeader title="Project Notes" />
      <CardContent>
        <ListSection
          title=""
          items={[
            'Working with agency for design drawing detail, quotation and local production.',
            'Produce window displays, signs, interior displays, floor plans and special promotions displays.',
            'Change displays to promote new product launches and reflect festive or seasonal themes.',
          ]}
        />
      </CardContent>
    </Card>
  );
}
