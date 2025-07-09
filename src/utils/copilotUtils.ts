
import { CopilotConfig } from '@/types/copilot';

export const createEmptyConfig = (): CopilotConfig => ({
  workLocationTypes: [],
  remoteLocations: [],
  onsiteLocations: [],
  jobTypes: [],
  jobTitles: [],
  stepCompleted: 1,
  filtersData: {},
  screeningData: {},
  finalConfigData: {},
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
  filtersData: {},
  screeningData: {},
  finalConfigData: {},
  resumeFileName: undefined,
  resumeFileUrl: undefined,
  personalInfo: {}
});

export const mapConfigToDatabase = (config: CopilotConfig, userId: string) => ({
  user_id: userId,
  work_location_types: config.workLocationTypes,
  remote_locations: config.remoteLocations,
  onsite_locations: config.onsiteLocations,
  job_types: config.jobTypes,
  job_titles: config.jobTitles,
  step_completed: config.stepCompleted
});
