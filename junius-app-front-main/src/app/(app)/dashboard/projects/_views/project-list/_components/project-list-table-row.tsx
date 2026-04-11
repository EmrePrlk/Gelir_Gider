'use client';

import RouterLink from 'next/link';
import { faker } from '@faker-js/faker';

import {
  Button,
  Avatar,
  TableRow,
  TableCell,
  ListItemText,
} from '@mui/material';

import { paths } from 'src/config/paths';
import { type Industry, getIndustryIcon } from 'src/definitions/industries';

import Iconify from 'src/components/iconify';

import { type IProject } from 'src/types/project';

import ProjectListTableRowTitle from './project-list-table-row-title';
import ProjectListTableRowProgress from './project-list-table-row-progress';
import { ProjectListTableRowActions } from './project-list-table-row-actions';
import ProjectListTableRowInterested from './project-list-table-row-interested';
import ProjectListTableRowStatusReadonly from './project-list-table-row-status-readonly';
// ----------------------------------------------------------------------

type Props = {
  row: IProject;
  compactMode?: boolean;
};

export default function ProjectListTableRow({
  row,
  compactMode = false,
}: Props) {
  if (compactMode) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }}>
          <Button
            sx={{ display: 'flex', alignItems: 'center', p: 2, pr: 0 }}
            component={RouterLink}
            href={paths.dashboard.projects.view(row.id.toString())}
          >
            <Avatar
              alt={row.title}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            >
              <Iconify
                width={32}
                icon={getIndustryIcon(row.category as Industry)}
              />
            </Avatar>
            <ListItemText
              sx={{ textAlign: 'left' }}
              primary={row.title}
              secondary={row.category}
              secondaryTypographyProps={{
                sx: { color: 'text.disabled' },
              }}
            />
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell sx={{ p: 0 }}>
        <Button
          sx={{ display: 'flex', alignItems: 'center', p: 2, pr: 0 }}
          component={RouterLink}
          href={paths.dashboard.projects.view(row.id.toString())}
        >
          <Avatar
            alt={row.title}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            <Iconify
              width={32}
              icon={getIndustryIcon(row.category as Industry)}
            />
          </Avatar>
          <ListItemText
            sx={{
              textAlign: 'left',
            }}
            primary={row.title}
            secondary={row.category}
            secondaryTypographyProps={{
              sx: {
                color: 'text.disabled',
              },
            }}
          />
        </Button>
      </TableCell>
      <TableCell>
        <ProjectListTableRowProgress />
      </TableCell>
      <TableCell>{faker.person.fullName()}</TableCell>
      <TableCell>
        <ProjectListTableRowStatusReadonly currentStatus={row.status} />
      </TableCell>
      <TableCell>
        <ProjectListTableRowInterested
          projectId={row.id}
          interestedId={row.interestedId}
          interested={row.interested ?? false}
        />
      </TableCell>
      <TableCell>
        <ProjectListTableRowTitle projectId={row.id} />
      </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <ProjectListTableRowActions projectId={row.id} />
      </TableCell>
    </TableRow>
  );
}
