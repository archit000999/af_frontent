
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

export const uploadResumeFile = async (file: File, userId: string) => {
  console.log('Starting uploadResumeFile with:', { fileName: file.name, fileType: file.type, fileSize: file.size, userId });
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  console.log('Generated file path:', fileName);
  
  try {
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Changed to true to allow overwriting
        contentType: file.type
      });

    console.log('Supabase upload response:', { data, error });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    // Get the public URL - note the bucket is not public so we need signed URL for access
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);

    return {
      fileName: file.name,
      filePath: fileName,
      fileUrl: publicUrl
    };
  } catch (error) {
    console.error('Error in uploadResumeFile:', error);
    throw error;
  }
};
