
export interface CopilotConfig {
  id?: string;
  workLocationTypes: string[];
  remoteLocations: string[];
  onsiteLocations: string[];
  jobTypes: string[];
  jobTitles: string[];
  stepCompleted: number;
  filtersData?: any;
  screeningData?: any;
  finalConfigData?: any;
  resumeFileName?: string;
  resumeFileUrl?: string;
  personalInfo?: any;
}
