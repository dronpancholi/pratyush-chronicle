import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';

export interface Issue {
  id: string;
  year: number;
  month: number;
  title: string;
  global_pdf_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface DepartmentIssue {
  id: string;
  issue_id: string;
  department_id: string;
  summary?: string;
  pdf_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  department?: {
    name: string;
    short_name: string;
  };
}

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [departmentIssues, setDepartmentIssues] = useState<DepartmentIssue[]>([]);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { hasRole } = useUserRole();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      
      setIssues(data || []);
      
      // Set the most recent published issue as current
      const publishedIssues = data?.filter(issue => issue.published_at) || [];
      if (publishedIssues.length > 0) {
        setCurrentIssue(publishedIssues[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentIssues = async (issueId?: string) => {
    try {
      let query = supabase
        .from('department_issues')
        .select(`
          *,
          department:departments(name, short_name)
        `);

      if (issueId) {
        query = query.eq('issue_id', issueId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      setDepartmentIssues(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const uploadGlobalNewsletter = async (file: File, metadata: { year: number; month: number; title: string }) => {
    if (!user || !hasRole(['admin', 'president'])) {
      throw new Error('Unauthorized: Admin or President access required');
    }

    try {
      setUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `global/${metadata.year}-${metadata.month.toString().padStart(2, '0')}-newsletter.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('newsletters')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('newsletters')
        .getPublicUrl(fileName);

      // Insert or update issue record
      const { data, error } = await supabase
        .from('issues')
        .upsert({
          year: metadata.year,
          month: metadata.month,
          title: metadata.title,
          global_pdf_url: publicUrl,
          created_by: user.id,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh issues list
      await fetchIssues();
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Upload failed' };
    } finally {
      setUploading(false);
    }
  };

  const uploadDepartmentNewsletter = async (
    file: File, 
    metadata: { 
      issue_id: string; 
      department_id: string; 
      summary?: string; 
    }
  ) => {
    if (!user || !profile) {
      throw new Error('Unauthorized: Please log in');
    }

    // Check permissions
    const hasPermission = hasRole(['admin', 'president']) || 
      (hasRole('contributor') && profile.department_id === metadata.department_id);
    
    if (!hasPermission) {
      throw new Error('Unauthorized: You can only upload to your assigned department');
    }

    try {
      setUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `department/${metadata.department_id}/${metadata.issue_id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('department-newsletters')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('department-newsletters')
        .getPublicUrl(fileName);

      // Insert or update department issue record
      const { data, error } = await supabase
        .from('department_issues')
        .upsert({
          issue_id: metadata.issue_id,
          department_id: metadata.department_id,
          summary: metadata.summary,
          pdf_url: publicUrl,
          created_by: user.id,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh department issues list
      await fetchDepartmentIssues();
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Upload failed' };
    } finally {
      setUploading(false);
    }
  };

  const publishIssue = async (issueId: string) => {
    if (!user || !hasRole(['admin', 'president'])) {
      throw new Error('Unauthorized: Admin or President access required');
    }

    try {
      const { error } = await supabase
        .from('issues')
        .update({ published_at: new Date().toISOString() })
        .eq('id', issueId);

      if (error) throw error;

      await fetchIssues();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to publish issue' };
    }
  };

  const unpublishIssue = async (issueId: string) => {
    if (!user || !hasRole(['admin', 'president'])) {
      throw new Error('Unauthorized: Admin or President access required');
    }

    try {
      const { error } = await supabase
        .from('issues')
        .update({ published_at: null })
        .eq('id', issueId);

      if (error) throw error;

      await fetchIssues();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to unpublish issue' };
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchDepartmentIssues();
  }, []);

  return {
    issues,
    departmentIssues,
    currentIssue,
    loading,
    uploading,
    error,
    fetchIssues,
    fetchDepartmentIssues,
    uploadGlobalNewsletter,
    uploadDepartmentNewsletter,
    publishIssue,
    unpublishIssue,
  };
};