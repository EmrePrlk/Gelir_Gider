import SeoIllustration from 'src/assets/illustrations/seo-illustration';
import ComingSoonIllustration from 'src/assets/illustrations/coming-soon-illustration';
import MaintenanceIllustration from 'src/assets/illustrations/maintenance-illustration';

import { type IRoleGroup } from 'src/types/role-group';

// note: SYNC THIS WITH THE BACKEND, ALWAYS
export enum RoleGroupEnum {
  DEVELOPER = 2,
  IDEATOR = 3,
  INVESTOR = 1,
  ADMIN = 4,
  SUPER_ADMIN = 5,
}

export const RoleGroups: IRoleGroup[] = [
  {
    id: RoleGroupEnum.DEVELOPER,
    name: 'Developer',
    description:
      'Collaborate with innovative minds to build, design, and code the next breakthrough solutions.',
    icon: MaintenanceIllustration,
    link: '/landing/developer',
  },
  {
    id: RoleGroupEnum.IDEATOR,
    name: 'Ideator',
    description:
      'Bring your vision to life. Share your ideas and collaborate with experts to transform concepts into reality.',
    icon: ComingSoonIllustration,
    link: '/landing/ideator',
  },
  {
    id: RoleGroupEnum.INVESTOR,
    name: 'Investor',
    description:
      'Support groundbreaking ventures and help fund the future by investing in projects with high potential.',
    icon: SeoIllustration,
    link: '/landing/investor',
  },
  {
    id: RoleGroupEnum.ADMIN,
    name: 'Admin',
    description:
      'Manage users, projects, and resources. Ensure the smooth operation of the platform.',
    icon: SeoIllustration,
    link: '/landing/admin',
    isHidden: true,
  },
  {
    id: RoleGroupEnum.SUPER_ADMIN,
    name: 'Super Admin',
    description:
      'Manage users, projects, and resources. Ensure the smooth operation of the platform.',
    icon: SeoIllustration,
    link: '/landing/super-admin',
    isHidden: true,
  },
];

export const getRoleGroupById = (id: number): IRoleGroup | undefined =>
  RoleGroups.find(roleGroup => roleGroup.id === id);
