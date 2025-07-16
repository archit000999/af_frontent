
import { CopilotConfig } from '../types/copilot';

export const createEmptyConfig = (): CopilotConfig => ({
  name: undefined,
  workLocationTypes: [],
  remoteLocations: [],
  onsiteLocations: [],
  jobTypes: [],
  jobTitles: [],
  stepCompleted: 1,
  filtersData: {},
  screeningData: {},
  finalConfigData: {},
  resumeFileName: undefined,
  resumeFileUrl: undefined,
  personalInfo: {}
});

export const canCreateNewCopilot = (allConfigs: CopilotConfig[], maxCopilots: number): boolean => {
  return allConfigs.length < Math.max(maxCopilots, 1);
};

export const getPlanName = (maxCopilots: number): string => {
  return maxCopilots === 1 ? 'Premium' : maxCopilots === 2 ? 'Elite' : 'Free';
};

export const mapDatabaseToConfig = (item: any): CopilotConfig => ({
  id: item.id,
  workLocationTypes: item.work_location_types || [],
  remoteLocations: item.remote_locations || [],
  onsiteLocations: item.onsite_locations || [],
  jobTypes: item.job_types || [],
  jobTitles: item.job_titles || [],
  stepCompleted: item.step_completed || 1,
  filtersData: item.filters_data || {},
  screeningData: item.screening_data || {},
  finalConfigData: item.final_config_data || {},
  resumeFileName: item.resume_file_name,
  resumeFileUrl: item.resume_file_url,
  personalInfo: item.personal_info || {}
});

export const mapConfigToDatabase = (config: CopilotConfig, userId: string) => ({
  user_id: userId,
  work_location_types: config.workLocationTypes,
  remote_locations: config.remoteLocations,
  onsite_locations: config.onsiteLocations,
  job_types: config.jobTypes,
  job_titles: config.jobTitles,
  step_completed: config.stepCompleted,
  filters_data: config.filtersData || {},
  screening_data: config.screeningData || {},
  final_config_data: config.finalConfigData || {},
  resume_file_name: config.resumeFileName,
  resume_file_url: config.resumeFileUrl,
  personal_info: config.personalInfo || {}
});
