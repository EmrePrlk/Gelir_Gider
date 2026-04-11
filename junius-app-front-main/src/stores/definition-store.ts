import { create } from 'zustand';

import {
  RoleGroups,
  PreferedTitles,
  EducationLevels,
  type EducationLevel,
  type IPreferedTitle,
  PreferedTitleExperiences,
  type PreferedTitleExperience,
} from 'src/definitions';

import { type IRoleGroup, type IPermission } from 'src/types/role-group';

interface DefinitionStore {
  preferedTitles: IPreferedTitle[];
  preferedTitleExperiences: PreferedTitleExperience[];
  educationLevels: EducationLevel[];
  roleGroups: IRoleGroup[];

  setRoleGroups: (roleGroups: IRoleGroup[]) => void;
  getRoleGroupById: (id: number) => IRoleGroup | undefined;
  setPermissions: (roleGroupId: number, permissions: IPermission[]) => void;

  setPreferedTitles: (preferedTitles: IPreferedTitle[]) => void;
  getPreferedTitleById: (id: string) => IPreferedTitle | undefined;

  setPreferedTitleExperiences: (
    preferedTitleExperiences: PreferedTitleExperience[],
  ) => void;
  getPreferedTitleExperienceById: (
    id: string,
  ) => PreferedTitleExperience | undefined;

  setEducationLevels: (educationLevels: EducationLevel[]) => void;
}

export const useDefinitionStore = create<DefinitionStore>((set, get) => ({
  preferedTitles: PreferedTitles,
  preferedTitleExperiences: PreferedTitleExperiences,
  educationLevels: EducationLevels,
  roleGroups: RoleGroups,

  setRoleGroups: (roleGroups: IRoleGroup[]) => set({ roleGroups }),
  getRoleGroupById: (id: number) =>
    get().roleGroups.find(roleGroup => roleGroup.id === id),
  setPermissions: (roleGroupId: number, permissions: IPermission[]) => {
    const roleGroup = get().roleGroups.find(rg => rg.id === roleGroupId);
    if (roleGroup) {
      roleGroup.permissions = permissions;
    }
  },

  setPreferedTitles: (preferedTitles: IPreferedTitle[]) =>
    set({ preferedTitles }),
  getPreferedTitleById: (id: string) =>
    get().preferedTitles.find(preferedTitle => preferedTitle.id === id),

  setPreferedTitleExperiences: (
    preferedTitleExperiences: PreferedTitleExperience[],
  ) => set({ preferedTitleExperiences }),
  getPreferedTitleExperienceById: (id: string) =>
    get().preferedTitleExperiences.find(
      preferedTitleExperience => preferedTitleExperience.id === id,
    ),
  setEducationLevels: (educationLevels: EducationLevel[]) =>
    set({ educationLevels }),
}));

export type {
  EducationLevel,
  IPreferedTitle,
  PreferedTitleExperience,
} from 'src/definitions';
