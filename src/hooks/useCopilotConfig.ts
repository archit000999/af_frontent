
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
}

export const useCopilotConfig = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [config, setConfig] = useState<CopilotConfig>({
    workLocationTypes: [],
    remoteLocations: [],
    onsiteLocations: [],
    jobTypes: [],
    jobTitles: [],
    stepCompleted: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load existing configuration on mount
  useEffect(() => {
    if (user && !isInitialized) {
      loadConfig();
    }
  }, [user, isInitialized]);

  const loadConfig = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load the most recent configuration (for display purposes)
      const { data, error } = await supabase
        .from('copilot_configurations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading config:', error);
        toast({
          title: "Error",
          description: "Failed to load your configuration",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setConfig({
          id: data.id,
          workLocationTypes: data.work_location_types || [],
          remoteLocations: data.remote_locations || [],
          onsiteLocations: data.onsite_locations || [],
          jobTypes: data.job_types || [],
          jobTitles: data.job_titles || [],
          stepCompleted: data.step_completed || 1
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast({
        title: "Error",
        description: "Failed to load your configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
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
        // Create new configuration (always creates a new record for new copilots)
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
      setConfig({
        id: result.data.id,
        workLocationTypes: result.data.work_location_types || [],
        remoteLocations: result.data.remote_locations || [],
        onsiteLocations: result.data.onsite_locations || [],
        jobTypes: result.data.job_types || [],
        jobTitles: result.data.job_titles || [],
        stepCompleted: result.data.step_completed || 1
      });

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

  return {
    config,
    updateConfig,
    saveConfig,
    loadConfig,
    isLoading,
    isInitialized
  };
};
