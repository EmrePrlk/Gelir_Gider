/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paths } from 'src/config/paths';
import { Industry } from 'src/definitions';
import { updateProject } from 'src/services/projects';
import { ProjectStatus } from 'src/definitions/project-status';
import { useProjectStore } from 'src/stores/project-list-store';

import { type IProject } from 'src/types/project';

export function useProjectForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [projectData] = useProjectStore(state => [state.project]);
  const queryClient = useQueryClient();

  const ProjectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    status: Yup.string()
      .oneOf(Object.values(ProjectStatus))
      .required('Status is required'),
    category: Yup.string()
      .oneOf(Object.values(Industry))
      .required('Category is required'),
    target_investment: Yup.number()
      .required('Target Investment is required')
      .min(1000, 'Target Investment must be greater than 1000$'),
    detail: Yup.string().required('Description is required'),
  });

  type ProjectFormData = Yup.InferType<typeof ProjectSchema>;

  const defaultValues: ProjectFormData = {
    title: '',
    status: ProjectStatus.Draft,
    category: Industry.TECHNOLOGY,
    target_investment: 0,
    detail: '',
  };

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (projectData) {
      reset({
        title: projectData.title,
        status: projectData.status,
        category: projectData.category as Industry,
        target_investment: projectData?.idea?.target_investment,
        detail: projectData?.detail,
      });
    }
  }, [projectData, reset]);

  const projectMutation = useMutation({
    mutationFn: (data: IProject) => updateProject(projectData?.id || -1, data),
    onSuccess: async updatedProject => {
      enqueueSnackbar('Project updated successfully', {
        variant: 'success',
      });
      await queryClient.invalidateQueries({
        queryKey: ['project'],
      });
      router.push(paths.dashboard.projects.view(updatedProject.id.toString()));
    },
    onError: error => setErrorMsg(error.message),
  });

  const onSubmit = handleSubmit(data => {
    // @ts-ignore
    data.idea_id = projectData?.idea_id;
    // @ts-ignore
    data = { ...data, idea: { target_investment: data.target_investment } };
    // @ts-ignore
    projectMutation.mutate(data);
  });

  return { methods, onSubmit, errorMsg, submitting: projectMutation.isPending };
}
