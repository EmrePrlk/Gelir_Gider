import { useMemo } from 'react';

import { paths } from 'src/config/paths';
import { icon } from 'src/app/(app)/_components/icon';
import { useAbility } from 'src/lib/casl/use-ability';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export function useNavData() {
  const ability = useAbility();
  const data = useMemo(
    () =>
      [
        {
          subheader: 'Overview',
          items: [
            {
              title: 'Dashboard',
              path: paths.dashboard.root,
              icon: icon('mdi:view-dashboard-outline'),
            },
          ],
        },
        {
          subheader: 'JUNIUS ECOSYSTEM',
          items: [
            {
              title: 'Projects',
              path: paths.dashboard.projects.root,
              icon: icon('mdi:folder-multiple-outline'),
            },
            {
              title: 'Ideas',
              path: paths.dashboard.ideas.root,
              icon: icon('mdi:lightbulb-outline'),
              children: [
                { title: 'All Ideas', path: paths.dashboard.ideas.root },
                {
                  title: 'Add New Idea',
                  path: paths.dashboard.ideas.new,
                },
              ],
            },
            {
              title: 'JunInvest',
              // path: paths.dashboard.juniVest,
              path: '#',
              icon: icon('mdi:cash-multiple'),
            },
            {
              title: 'Junius Intelligence',
              // path: paths.dashboard.juniusIntelligence,
              path: '#',
              icon: icon('mdi:brain'),

              info: <Label color="info">PRO</Label>,
            },
          ],
        },
        {
          subheader: 'Junius Business',
          items: [
            {
              title: 'JuniFlow',
              // path: paths.dashboard.juniusBusiness.flow,
              path: '#',

              icon: icon('iconoir:agile'),
            },
            {
              title: 'JuniDocs',
              // path: paths.dashboard.juniusBusiness.docs,
              path: '#',

              icon: icon('mdi:file-document-outline'),
            },
            {
              title: 'JuniCalendar',
              // path: paths.dashboard.juniusBusiness.calendar,
              path: '#',

              icon: icon('mdi:calendar-blank-outline'),
            },
            {
              title: 'JuniMail',
              // path: paths.dashboard.juniusBusiness.mail,
              path: '#',

              icon: icon('mdi:email-outline'),
            },
            {
              title: 'JuniTeams',
              // path: paths.dashboard.juniusBusiness.teams,
              path: '#',

              icon: icon('mdi:account-group-outline'),
            },
          ],
        },
        ability.can('create', 'customuser')
          ? {
              subheader: 'Management',
              items: [
                {
                  title: 'User List',
                  path: paths.dashboard.admin.userList,
                  icon: icon('mdi:security-account-outline'),
                },
              ],
            }
          : undefined,
        ability.can('create', 'group')
          ? {
              subheader: 'Superuser',
              items: [
                {
                  title: 'Permissions',
                  path: paths.dashboard.su.permissions,
                  icon: icon('material-symbols:security'),
                },
              ],
            }
          : undefined,
      ]
        .filter(item => item !== undefined)
        .filter(item => item.items !== undefined && item.items.length > 0),
    [ability],
  );

  return data;
}
