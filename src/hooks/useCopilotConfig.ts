import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CopilotConfig {
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

export const useCopilotConfig = (maxCopilots: number = 1) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [config, setConfig] = useState<CopilotConfig>({
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
      // Load all configurations for the user - only select columns that definitely exist
      const { data, error } = await supabase
        .from('copilot_configurations')
        .select('id, user_id, work_location_types, remote_locations, onsite_locations, job_types, job_titles, step_completed, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading configs:', error);
        toast({
          title: "Error",
          description: "Failed to load your configurations",
          variant: "destructive"
        });
        return;
      }

      const configs = data?.map(item => ({
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
      })) || [];

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
    // Always allow creating at least one copilot for configuration
    return allConfigs.length < Math.max(maxCopilots, 1);
  };

  const createNewCopilot = () => {
    if (!canCreateNewCopilot()) {
      const planName = maxCopilots === 1 ? 'Premium' : maxCopilots === 2 ? 'Elite' : 'Free';
      toast({
        title: "Limit Reached",
        description: `You can only create up to ${Math.max(maxCopilots, 1)} copilot configuration${Math.max(maxCopilots, 1) > 1 ? 's' : ''} with your ${planName} plan`,
        variant: "destructive"
      });
      return false;
    }

    // Reset to fresh state for new copilot
    setConfig({
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
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading resume:', error);
        toast({
          title: "Upload Error",
          description: "Failed to upload resume",
          variant: "destructive"
        });
        return null;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      return {
        fileName: file.name,
        filePath: fileName,
        fileUrl: publicUrl
      };
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

  const saveConfig = async (updatedConfig?: Partial<CopilotConfig>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your configuration",
        variant: "destructive"
      });
      return false;
    }

    const configToSave = updatedConfig ? { ...config, ...updatedConfig } : config;
    setIsLoading(true);

    try {
      // Only save the basic fields that we know exist in the database
      const configData = {
        user_id: user.id,
        work_location_types: configToSave.workLocationTypes,
        remote_locations: configToSave.remoteLocations,
        onsite_locations: configToSave.onsiteLocations,
        job_types: configToSave.jobTypes,
        job_titles: configToSave.jobTitles,
        step_completed: configToSave.stepCompleted
      };

      let result;
      if (configToSave.id) {
        // Update existing configuration
        result = await supabase
          .from('copilot_configurations')
          .update(configData)
          .eq('id', configToSave.id)
          .select()
          .single();
      } else {
        // Allow creating at least one copilot even without subscription
        if (!canCreateNewCopilot() && maxCopilots > 0) {
          const planName = maxCopilots === 1 ? 'Premium' : maxCopilots === 2 ? 'Elite' : 'Free';
          toast({
            title: "Limit Reached",
            description: `You can only create up to ${Math.max(maxCopilots, 1)} copilot configuration${Math.max(maxCopilots, 1) > 1 ? 's' : ''} with your ${planName} plan`,
            variant: "destructive"
          });
          return false;
        }

        // Create new configuration
        result = await supabase
          .from('copilot_configurations')
          .insert([configData])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving config:', result.error);
        toast({
          title: "Error",
          description: "Failed to save your configuration",
          variant: "destructive"
        });
        return false;
      }

      // Update local state with saved data
      const savedConfig = {
        id: result.data.id,
        workLocationTypes: result.data.work_location_types || [],
        remoteLocations: result.data.remote_locations || [],
        onsiteLocations: result.data.onsite_locations || [],
        jobTypes: result.data.job_types || [],
        jobTitles: result.data.job_titles || [],
        stepCompleted: result.data.step_completed || 1,
        filtersData: {},
        screeningData: {},
        finalConfigData: {},
        resumeFileName: undefined,
        resumeFileUrl: undefined,
        personalInfo: {}
      };

      setConfig(savedConfig);

      // Refresh all configs to keep them in sync
      await loadAllConfigs();

      toast({
        title: "Success",
        description: "Your copilot configuration has been saved"
      });
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Failed to save your configuration",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
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
      
      // Delete from database
      const { error } = await supabase
        .from('copilot_configurations')
        .delete()
        .eq('id', configId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting config:', error);
        toast({
          title: "Error",
          description: "Failed to delete configuration",
          variant: "destructive"
        });
        return false;
      }

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
