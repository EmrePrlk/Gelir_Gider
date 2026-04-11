import { create } from 'zustand';

import { type IProject, type IProjectListResponse } from 'src/types/project';

type IFilters = Partial<IProject>;

const defaultFilters: IFilters = {
  status: undefined,
  title: '',
  category: '',
};

interface ProjectlistStore {
  filters: IFilters;
  canReset: boolean;

  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;

  setFilters: (filters: IFilters) => void;
  resetFilters: () => void;

  setPagination: (pagination: IProjectListResponse) => void;
  changePage: (page: number) => void;
}

export const useProjectListStore = create<ProjectlistStore>(set => ({
  filters: defaultFilters,
  canReset: false,
  page: 1,
  limit: 0,
  totalPages: 1,
  totalResults: 0,

  setFilters: (newFilters: IFilters) =>
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      return {
        filters: updatedFilters,
        canReset:
          JSON.stringify(updatedFilters) !== JSON.stringify(defaultFilters),
      };
    }),

  resetFilters: () => set({ filters: defaultFilters, canReset: false }),

  setPagination: pagination =>
    set({
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      totalResults: pagination.totalResults,
    }),
  changePage: newPage => set({ page: newPage }),
}));

interface ProjectlistStore {
  filters: IFilters;
  canReset: boolean;

  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;

  setFilters: (filters: IFilters) => void;
  resetFilters: () => void;

  setPagination: (pagination: IProjectListResponse) => void;
  changePage: (page: number) => void;
}
interface ProjectStore {
  project: IProject | null;
  setProject: (project: IProject) => void;
}

export const useProjectStore = create<ProjectStore>(set => ({
  project: null,
  setProject: project => set({ project }),
}));
