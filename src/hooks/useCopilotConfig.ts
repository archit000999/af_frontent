import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { CopilotConfig } from '@/types/copilot';
import { 
  createEmptyConfig, 
  canCreateNewCopilot as canCreateNewCopilotUtil, 
  getPlanName 
} from '@/utils/copilotUtils';
import { 
  loadAllConfigs as loadAllConfigsService,
  saveConfigToDatabase,
  deleteConfigFromDatabase,
  uploadResumeFile
} from '@/services/copilotService';

export const useCopilotConfig = (maxCopilots: number = 1) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [config, setConfig] = useState<CopilotConfig>(createEmptyConfig());
  const [allConfigs, setAllConfigs] = useState<CopilotConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load all existing configurations on mount
  useEffect(() => {
    if (user && !isInitialized) {
      loadAllConfigs();
    }
  }, [user, isInitialized]);

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
        description: `You can only create up to ${Math.max(maxCopilots, 1)} copilot configuration${Math.max(maxCopilots, 1) > 1 ? 's' : ''} with your ${planName} plan`,
        variant: "destructive"
      });
      return false;
    }

    // Reset to fresh state for new copilot
    setConfig(createEmptyConfig());
    return true;
  };

  const uploadResume = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload your resume",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsLoading(true);
      return await uploadResumeFile(file, user.id);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload resume",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (updatedConfig?: Partial<CopilotConfig>, silent: boolean = false) => {
    if (!user) {
      if (!silent) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your configuration",
          variant: "destructive"
        });
      }
      return false;
    }

    const configToSave = updatedConfig ? { ...config, ...updatedConfig } : config;
    if (!silent) {
      setIsLoading(true);
    }

    try {
      // Check limits for new configurations
      if (!configToSave.id && !canCreateNewCopilot() && maxCopilots > 0) {
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

      const savedConfig = await saveConfigToDatabase(configToSave, user.id);
      setConfig(savedConfig);

      // Refresh all configs to keep them in sync
      await loadAllConfigs();

      if (!silent) {
        toast({
          title: "Success",
          description: "Your copilot configuration has been saved"
        });
      }
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
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
    if (!user) return false;

    try {
      setIsLoading(true);
      await deleteConfigFromDatabase(configId, user.id);
      
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
