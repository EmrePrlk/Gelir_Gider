export enum ProjectStatus {
  Development = 'Development',
  Stage = 'Stage',
  Prod = 'Production',
  Test = 'Test',
  Planning = 'Planning',
  Draft = 'Draft',
}

export const getProjectStatusIcon = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.Development: {
      return 'mdi:code-braces';
    }
    case ProjectStatus.Stage: {
      return 'mdi:test-tube';
    }
    case ProjectStatus.Prod: {
      return 'mdi:rocket-launch';
    }
    case ProjectStatus.Test: {
      return 'mdi:clipboard-check-outline';
    }
    case ProjectStatus.Planning: {
      return 'mdi:clipboard-text-outline';
    }
    case ProjectStatus.Draft: {
      return 'mdi:file-document-outline';
    }
    default: {
      return 'mdi:help-circle-outline';
    }
  }
};
