import { CopilotConfig } from '../types/copilot';
import { copilotAPI } from './api';

// Map frontend config to backend format
const mapConfigToBackend = (config: CopilotConfig) => {
  return {
    name: config.name || 'My Copilot Configuration',
    stepCompleted: config.stepCompleted || 1,
    
    // Step 1: Direct mapping for frontend structure
    workLocationTypes: config.workLocationTypes || [],
    remoteLocations: config.remoteLocations || [],
    onsiteLocations: config.onsiteLocations || [],
    jobTypes: config.jobTypes || [],
    jobTitles: config.jobTitles || [],
    
    // Step 2: Filters data - direct mapping
    filtersData: config.filtersData || {},
    
    // Step 3: Screening data - direct mapping + legacy structure
    screeningData: {
      ...config.screeningData,
      firstName: config.screeningData?.firstName,
      lastName: config.screeningData?.lastName,
      email: config.screeningData?.email,
      phone: config.screeningData?.phone,
      linkedIn: config.screeningData?.linkedIn,
      portfolio: config.screeningData?.portfolio,
      coverLetter: config.screeningData?.coverLetter,
      personalInfo: config.personalInfo || {},
      resume: {
        fileName: config.resumeFileName,
        fileUrl: config.resumeFileUrl,
        extractedData: {
          skills: [],
          experience: [],
          education: [],
          certifications: []
        }
      },
      additionalQuestions: config.screeningData?.additionalQuestions || []
    },
    
    // Resume files at top level
    resumeFileName: config.resumeFileName,
    resumeFileUrl: config.resumeFileUrl,
    
    // Step 4: Final config data - direct mapping
    finalConfigData: config.finalConfigData || {},
    
    // Legacy structures for backward compatibility
    jobSetup: {
      jobTitles: config.jobTitles || [],
      locations: [...(config.remoteLocations || []), ...(config.onsiteLocations || [])],
      workMode: config.workLocationTypes?.includes('remote') && config.workLocationTypes?.includes('onsite') 
        ? 'hybrid' 
        : config.workLocationTypes?.includes('remote') 
        ? 'remote' 
        : config.workLocationTypes?.includes('onsite') 
        ? 'onsite' 
        : 'all',
      isActive: false
    },
    filters: {
      salaryRange: {
        min: config.filtersData?.salaryRange?.min || 0,
        max: config.filtersData?.salaryRange?.max || 0,
        currency: 'USD'
      },
      companySize: config.filtersData?.companySize || [],
      industries: config.filtersData?.industries || [],
      keywords: config.filtersData?.keywords || [],
      excludeKeywords: config.filtersData?.excludeKeywords || [],
      jobType: config.jobTypes?.[0] || 'full-time'
    },
    finalConfig: {
      mode: config.finalConfigData?.selectedMode || 'auto-apply',
      writingStyle: {
        sentenceLength: config.finalConfigData?.sentenceLength || 'balanced-mix',
        tone: config.finalConfigData?.tone || 'neutral-casual',
        vocabularyComplexity: config.finalConfigData?.vocabularyComplexity || 'simple-everyday'
      },
      notifications: config.finalConfigData?.notifications || {}
    },
    
    isCompleted: config.stepCompleted === 4,
    isActive: false
  };
};

// Map backend response to frontend format
const mapBackendToConfig = (backendConfig: any): CopilotConfig => {
  return {
    id: backendConfig._id,
    name: backendConfig.name,
    
    // Step 1: Direct mapping from new structure, fallback to legacy
    workLocationTypes: backendConfig.workLocationTypes || 
      (backendConfig.jobSetup?.workMode === 'hybrid' 
        ? ['remote', 'onsite']
        : backendConfig.jobSetup?.workMode === 'all'
        ? ['remote', 'onsite']
        : [backendConfig.jobSetup?.workMode || 'remote']),
    remoteLocations: backendConfig.remoteLocations || 
      (backendConfig.jobSetup?.workMode === 'remote' || backendConfig.jobSetup?.workMode === 'hybrid' 
        ? backendConfig.jobSetup?.locations || []
        : []),
    onsiteLocations: backendConfig.onsiteLocations ||
      (backendConfig.jobSetup?.workMode === 'onsite' || backendConfig.jobSetup?.workMode === 'hybrid'
        ? backendConfig.jobSetup?.locations || []
        : []),
    jobTypes: backendConfig.jobTypes || [backendConfig.filters?.jobType || 'fulltime'],
    jobTitles: backendConfig.jobTitles || backendConfig.jobSetup?.jobTitles || [],
    
    stepCompleted: backendConfig.stepCompleted || 1,
    
    // Step 2: Direct mapping from new structure, fallback to legacy
    filtersData: backendConfig.filtersData || {
      salaryRange: backendConfig.filters?.salaryRange || {},
      companySize: backendConfig.filters?.companySize || [],
      industries: backendConfig.filters?.industries || [],
      keywords: backendConfig.filters?.keywords || [],
      excludeKeywords: backendConfig.filters?.excludeKeywords || []
    },
    
    // Step 3: Direct mapping from new structure, fallback to legacy
    screeningData: backendConfig.screeningData || {
      additionalQuestions: backendConfig.screeningData?.additionalQuestions || []
    },
    
    // Step 4: Direct mapping from new structure, fallback to legacy
    finalConfigData: backendConfig.finalConfigData || {
      selectedMode: backendConfig.finalConfig?.mode || 'auto-apply',
      sentenceLength: backendConfig.finalConfig?.writingStyle?.sentenceLength || 'balanced-mix',
      tone: backendConfig.finalConfig?.writingStyle?.tone || 'neutral-casual',
      vocabularyComplexity: backendConfig.finalConfig?.writingStyle?.vocabularyComplexity || 'simple-everyday',
      notifications: backendConfig.finalConfig?.notifications || {}
    },
    
    // Resume files
    resumeFileName: backendConfig.resumeFileName || backendConfig.screeningData?.resume?.fileName,
    resumeFileUrl: backendConfig.resumeFileUrl || backendConfig.screeningData?.resume?.fileUrl,
    
    // Personal info - check both new and legacy structure
    personalInfo: backendConfig.screeningData?.personalInfo || 
      (backendConfig.screeningData ? {
        firstName: backendConfig.screeningData.firstName,
        lastName: backendConfig.screeningData.lastName,
        email: backendConfig.screeningData.email,
        phone: backendConfig.screeningData.phone,
        linkedIn: backendConfig.screeningData.linkedIn,
        portfolio: backendConfig.screeningData.portfolio
      } : {})
  };
};

export const loadAllConfigs = async (userId: string): Promise<CopilotConfig[]> => {
  try {
    const response = await copilotAPI.getAll();
    return (response.copilots || []).map(mapBackendToConfig);
  } catch (error) {
    console.error('Error loading configs:', error);
    return [];
  }
};

export const loadAllConfigsService = async (userId: string): Promise<CopilotConfig[]> => {
  return loadAllConfigs(userId);
};

export const saveConfigToDatabase = async (config: CopilotConfig, userId: string): Promise<CopilotConfig> => {
  try {
    const backendData = mapConfigToBackend(config);
    
    if (config.id) {
      // Update existing configuration
      const response = await copilotAPI.update(config.id, backendData);
      return mapBackendToConfig(response.config);
    } else {
      // Create new configuration
      const response = await copilotAPI.create(backendData);
      return mapBackendToConfig(response.config);
    }
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
};

export const deleteConfigFromDatabase = async (configId: string, userId: string): Promise<boolean> => {
  try {
    await copilotAPI.delete(configId);
    return true;
  } catch (error) {
    console.error('Error deleting config:', error);
    throw error;
  }
};

export const uploadFile = async (file: File): Promise<{ fileName: string; fileUrl: string }> => {
  try {
    // Create a simple file URL for demo purposes
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    
    return {
      fileName,
      fileUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
