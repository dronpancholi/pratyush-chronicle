import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Newsletter {
  id: string;
  title: string;
  description?: string;
  issue_date: string;
  year: number;
  month: number;
  pdf_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useNewsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('is_published', true)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      
      setNewsletters(data || []);
      
      // Set the most recent newsletter as current
      if (data && data.length > 0) {
        setCurrentNewsletter(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadNewsletter = async (file: File, metadata: Omit<Newsletter, 'id' | 'created_at' | 'updated_at' | 'pdf_url'>) => {
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${metadata.year}-${metadata.month.toString().padStart(2, '0')}-newsletter.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('newsletters')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('newsletters')
        .getPublicUrl(fileName);

      // Insert newsletter record
      const { data, error } = await supabase
        .from('newsletters')
        .insert({
          ...metadata,
          pdf_url: publicUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh newsletters list
      await fetchNewsletters();
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Upload failed' };
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return {
    newsletters,
    currentNewsletter,
    loading,
    error,
    fetchNewsletters,
    uploadNewsletter,
  };
};