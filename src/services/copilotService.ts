
import { supabase } from '@/integrations/supabase/client';
import { CopilotConfig } from '@/types/copilot';
import { mapDatabaseToConfig, mapConfigToDatabase } from '@/utils/copilotUtils';

export const loadAllConfigs = async (userId: string): Promise<CopilotConfig[]> => {
  const { data, error } = await supabase
    .from('copilot_configurations')
    .select('*')
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

export const uploadResumeFile = async (file: File, clerkToken: string) => {
  console.log('Starting uploadResumeFile with:', { fileName: file.name, fileType: file.type, fileSize: file.size });
  
  try {
    // Create FormData for the file upload
    const formData = new FormData();
    formData.append('file', file);

    // Call the Edge Function instead of direct Supabase
    const response = await fetch('https://osuyeptufjtmqsydulmq.supabase.co/functions/v1/upload-resume', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      console.error('Edge function error:', errorData);
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    console.log('Upload successful:', result);

    return {
      fileName: result.fileName,
      filePath: result.filePath,
      fileUrl: result.fileUrl
    };
  } catch (error) {
    console.error('Error in uploadResumeFile:', error);
    throw error;
  }
};
