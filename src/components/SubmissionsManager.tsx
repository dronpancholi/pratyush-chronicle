import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Star, ExternalLink, Trash2 } from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  category: string;
  department: string | null;
  semester: number | null;
  media_url: string | null;
  external_link: string | null;
  submitter_name: string | null;
  student_name: string;
  status: string | null;
  pinned: boolean | null;
  created_at: string | null;
}

const SubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching submissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Submission ${status}`,
        description: status === 'approved' 
          ? "The submission is now visible in the Students' section."
          : "The submission has been rejected.",
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error updating submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ pinned: !currentPinned })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentPinned ? "Unpinned" : "Pinned",
        description: currentPinned 
          ? "Submission removed from featured."
          : "Submission is now featured.",
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error updating pin status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Submission deleted",
        description: "The submission has been removed.",
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error deleting submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Student Submissions</span>
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No {filter === 'all' ? '' : filter} submissions found.
          </p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(submission.status)}
                      <h4 className="font-semibold">{submission.title}</h4>
                      {submission.pinned && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {submission.submitter_name || submission.student_name} • {submission.department} • {submission.category}
                    </p>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>

                <p className="text-sm">{submission.summary || submission.description}</p>

                {submission.media_url && (
                  <img
                    src={submission.media_url}
                    alt={submission.title}
                    className="h-24 w-auto rounded-lg object-cover"
                  />
                )}

                {submission.external_link && (
                  <a
                    href={submission.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    View Project <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                  {submission.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(submission.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(submission.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {submission.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePin(submission.id, !!submission.pinned)}
                    >
                      <Star className={`h-4 w-4 mr-1 ${submission.pinned ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      {submission.pinned ? 'Unpin' : 'Pin as Featured'}
                    </Button>
                  )}
                  {submission.status === 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(submission.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Instead
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto text-destructive hover:text-destructive"
                    onClick={() => deleteSubmission(submission.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsManager;