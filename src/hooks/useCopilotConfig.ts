import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { CopilotConfig } from '../types/copilot';
import { 
  createEmptyConfig, 
  canCreateNewCopilot as canCreateNewCopilotUtil, 
  getPlanName 
} from '../utils/copilotUtils';
import { 
  loadAllConfigs as loadAllConfigsService,
  saveConfigToDatabase,
  deleteConfigFromDatabase
} from '../services/copilotService';
import { useAuth } from '../contexts/AuthContext';

export const useCopilotConfig = (maxCopilots: number = 1) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [config, setConfig] = useState<CopilotConfig>(createEmptyConfig());
  const [allConfigs, setAllConfigs] = useState<CopilotConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load all existing configurations on mount
  useEffect(() => {
    if (!isInitialized && isAuthenticated && user) {
      loadAllConfigs();
    }
  }, [isInitialized, isAuthenticated, user]);

  const loadAllConfigs = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const configs = await loadAllConfigsService(user.id);
      setAllConfigs(configs);

      // Set the most recent config as current
      if (configs.length > 0) {
        setConfig(configs[0]);
      }
    } catch (error) {
      console.error('Error loading configs:', error);
      toast({
        title: "Error",
        description: "Failed to load your configurations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const loadConfig = async () => {
    // This method is kept for compatibility but now just calls loadAllConfigs
    await loadAllConfigs();
  };

  const canCreateNewCopilot = () => {
    return canCreateNewCopilotUtil(allConfigs, maxCopilots);
  };

  const createNewCopilot = () => {
    if (!canCreateNewCopilot()) {
      const planName = getPlanName(maxCopilots);
      toast({
        title: "Limit Reached",
        description: `You can only create up to ${Math.max(maxCopilots, 1)} ApplyFirst configuration${Math.max(maxCopilots, 1) > 1 ? 's' : ''} with your ${planName} plan`,
        variant: "destructive"
      });
      return false;
    }

    // Check if there's an existing incomplete configuration
    const incompleteConfig = allConfigs.find(c => (c.stepCompleted || 1) < 4);
    
    if (incompleteConfig) {
      // Continue with the existing incomplete configuration
      setConfig(incompleteConfig);
    } else {
      // Reset to fresh state for truly new copilot
      setConfig(createEmptyConfig());
    }
    
    return true;
  };

  const uploadResume = async (file: File) => {
    console.log('uploadResume called with file:', file.name);

    try {
      setIsLoading(true);
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 10MB.');
      }

      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedFileName}`;
      
      console.log('Processing file:', fileName);

      // Create a file URL for local storage
      const fileUrl = URL.createObjectURL(file);

      console.log('File processed successfully');

      // Update configuration with resume info
      const resumeData = {
        resumeFileName: fileName,
        resumeFileUrl: fileUrl
      };

      // Update local config
      updateConfig(resumeData);

      // Auto-save the config
      const success = await saveConfig(resumeData, true); // silent save
      
      if (!success) {
        throw new Error('Failed to save resume information');
      }

      
      return {
        fileName: fileName,
        fileUrl: fileUrl
      };
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      
      let errorMessage = "Failed to upload resume";
      
      if (error?.message?.includes('413')) {
        errorMessage = "File too large. Please use a file smaller than 10MB.";
      } else if (error?.message?.includes('415')) {
        errorMessage = "Unsupported file type. Please use PDF or Word documents.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (updatedConfig?: Partial<CopilotConfig>, silent: boolean = false) => {
    if (!user) return false;
    
    const configToSave = updatedConfig ? { ...config, ...updatedConfig } : config;
    if (!silent) {
      setIsLoading(true);
    }

    try {
      // For new configurations, check if user already has one in progress
      if (!configToSave.id) {
        // Check if user already has a configuration in progress (stepCompleted < 4)
        const existingConfig = allConfigs.find(c => (c.stepCompleted || 1) < 4);
        
        if (existingConfig) {
          // Update the existing in-progress configuration instead of creating new one
          configToSave.id = existingConfig.id;
          // Make sure stepCompleted is updated correctly
          configToSave.stepCompleted = Math.max(
            existingConfig.stepCompleted || 1, 
            configToSave.stepCompleted || 1
          );
        } else {
          // Check limits for truly new configurations
          if (!canCreateNewCopilot() && maxCopilots > 0) {
            const planName = getPlanName(maxCopilots);
            if (!silent) {
              toast({
                title: "Limit Reached",
                description: `You can only create up to ${Math.max(maxCopilots, 1)} copilot configuration${Math.max(maxCopilots, 1) > 1 ? 's' : ''} with your ${planName} plan`,
                variant: "destructive"
              });
            }
            return false;
          }
        }
      } else {
        // For existing configs, ensure stepCompleted is progressing forward
        const existingConfig = allConfigs.find(c => c.id === configToSave.id);
        if (existingConfig) {
          configToSave.stepCompleted = Math.max(
            existingConfig.stepCompleted || 1, 
            configToSave.stepCompleted || 1
          );
        }
      }

      const savedConfig = await saveConfigToDatabase(configToSave, user.id);
      setConfig(savedConfig);

      // Refresh all configs to keep them in sync
      await loadAllConfigs();

      if (!silent) {
        toast({
          title: "Success",
          description: "Your ApplyFirst configuration has been saved"
        });
      }
      return true;
    } catch (error) {
      console.error('Save config error:', error);
      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to save your configuration",
          variant: "destructive"
        });
      }
      return false;
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const updateConfig = (updates: Partial<CopilotConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const switchToConfig = (configId: string) => {
    const foundConfig = allConfigs.find(c => c.id === configId);
    if (foundConfig) {
      setConfig(foundConfig);
    }
  };

  const deleteConfig = async (configId: string) => {
    try {
      setIsLoading(true);
      await deleteConfigFromDatabase(configId, 'demo-user');
      
      // Refresh configs
      await loadAllConfigs();
      
      toast({
        title: "Success",
        description: "Configuration deleted successfully"
      });
      return true;
    } catch (error) {
      console.error('Error deleting config:', error);
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    allConfigs,
    updateConfig,
    saveConfig,
    loadConfig,
    loadAllConfigs,
    createNewCopilot,
    canCreateNewCopilot,
    switchToConfig,
    deleteConfig,
    uploadResume,
    isLoading,
    isInitialized,
    maxCopilots
  };
};
