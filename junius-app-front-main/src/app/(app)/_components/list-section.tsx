import { Box, List, ListItem, Typography, ListItemText } from '@mui/material';

interface ListSectionProps {
  title?: string;
  items: string[];
}

export default function ListSection({ title, items }: ListSectionProps) {
  return (
    <Box>
      {title && <Typography variant="subtitle1">{title}</Typography>}
      <List
        sx={{
          listStyleType: 'disc',
          pl: 4,
          '& .MuiListItem-root': {
            display: 'list-item',
            pl: 0,
            py: 0,
          },
          '& .MuiListItemText-root': {
            m: 0,
          },
        }}
      >
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
