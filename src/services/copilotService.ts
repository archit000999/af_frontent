
import { supabase } from '@/integrations/supabase/client';
import { CopilotConfig } from '@/types/copilot';
import { mapDatabaseToConfig, mapConfigToDatabase } from '@/utils/copilotUtils';

export const loadAllConfigs = async (userId: string): Promise<CopilotConfig[]> => {
  const { data, error } = await supabase
    .from('copilot_configurations')
    .select('id, user_id, work_location_types, remote_locations, onsite_locations, job_types, job_titles, step_completed, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data?.map(mapDatabaseToConfig) || [];
};

export const saveConfigToDatabase = async (config: CopilotConfig, userId: string): Promise<CopilotConfig> => {
  const configData = mapConfigToDatabase(config, userId);

  let result;
  if (config.id) {
    // Update existing configuration
    result = await supabase
      .from('copilot_configurations')
      .update(configData)
      .eq('id', config.id)
      .select()
      .single();
  } else {
    // Create new configuration
    result = await supabase
      .from('copilot_configurations')
      .insert([configData])
      .select()
      .single();
  }

  if (result.error) {
    throw result.error;
  }

  return mapDatabaseToConfig(result.data);
};

export const deleteConfigFromDatabase = async (configId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('copilot_configurations')
    .delete()
    .eq('id', configId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

export const uploadResumeFile = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
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
};
