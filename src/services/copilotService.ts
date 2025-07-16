import { CopilotConfig } from '@/types/copilot';

// Simple in-memory storage for demo
let configsStore: Record<string, CopilotConfig[]> = {};

export const loadAllConfigs = async (userId: string): Promise<CopilotConfig[]> => {
  try {
    return configsStore[userId] || [];
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
    if (!configsStore[userId]) {
      configsStore[userId] = [];
    }
    
    if (config.id) {
      // Update existing configuration
      const index = configsStore[userId].findIndex((c: CopilotConfig) => c.id === config.id);
      if (index !== -1) {
        configsStore[userId][index] = config;
      } else {
        configsStore[userId].push(config);
      }
    } else {
      // Create new configuration
      const newConfig = { ...config, id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
      configsStore[userId].push(newConfig);
      return newConfig;
    }
    
    return config;
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
};

export const deleteConfigFromDatabase = async (configId: string, userId: string): Promise<boolean> => {
  try {
    if (!configsStore[userId]) {
      return false;
    }
    
    const index = configsStore[userId].findIndex(c => c.id === configId);
    if (index !== -1) {
      configsStore[userId].splice(index, 1);
      return true;
    }
    
    return false;
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
