/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
'use client';
import { PureAbility, AbilityBuilder, type AbilityClass } from '@casl/ability';

import { type IPermission } from 'src/types/role-group';

export type Actions = 'create' | 'read' | 'update' | 'delete';
export type Subjects =
  | 'customuser'
  | 'usercertificate'
  | 'usereducation'
  | 'userexperience'
  | 'userlanguage'
  | 'usernotesforhr'
  | 'logentry'
  | 'group'
  | 'permission'
  | 'idea'
  | 'ideaprocesslog'
  | 'interestedproject'
  | 'project'
  | 'projectdocument'
  | 'projectinvestment'
  | 'projectlink'
  | 'projectstaff'
  | 'projectstatus'
  | 'contenttype'
  | 'language'
  | 'menu'
  | 'menurole'
  | 'projectmapsjuniflow'
  | 'projectpartner'
  | 'role'
  | 'skill'
  | 'title'
  | 'usermapsjuniflow'
  | 'userprofiletype'
  | 'userrole'
  | 'session'
  | string;

export type IAppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<IAppAbility>;

export function defineAbilityFor(permissions: IPermission[]) {
  const { can, build } = new AbilityBuilder(AppAbility);

  permissions.forEach(permission => {
    const action = getActionFromCodename(permission.codename);
    const subject = getSubjectFromCodename(permission.codename);
    can(action, subject);
  });

  return build();
}

export function getActionFromCodename(codename: string): Actions {
  if (codename.startsWith('add_')) return 'create';
  if (codename.startsWith('view_')) return 'read';
  if (codename.startsWith('change_')) return 'update';
  if (codename.startsWith('delete_')) return 'delete';
  return 'read';
}

export function getSubjectFromCodename(codename: string): Subjects {
  return codename.split('_')[1] || 'all';
}
