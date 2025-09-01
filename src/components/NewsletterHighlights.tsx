import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { useIssues } from '@/hooks/useIssues';
import { Link } from 'react-router-dom';

const NewsletterHighlights = () => {
  const { currentIssue, loading } = useIssues();

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-secondary rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-secondary rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentIssue) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Latest Newsletter</h2>
            <p className="text-lg text-muted-foreground">
              No newsletters published yet
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="academic-card">
              <CardContent className="text-center py-12">
                <div className="bg-secondary/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  The first issue of the Pratyush Newsletter will be available here soon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Latest Newsletter</h2>
          <p className="text-lg text-muted-foreground">
            {currentIssue.title} - Now Available
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="academic-card border-primary/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary text-primary-foreground rounded-full p-4">
                  <FileText className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl">{currentIssue.title}</CardTitle>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {currentIssue.published_at && formatDate(currentIssue.published_at)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PDF Preview Placeholder */}
              <div className="bg-secondary/30 rounded-lg aspect-[3/4] max-w-md mx-auto flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">PDF Preview</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click "View Online" to read the full newsletter
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/current-issue">
                    <Eye className="h-4 w-4 mr-2" />
                    View Online
                  </Link>
                </Button>
                {currentIssue.global_pdf_url && (
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a href={currentIssue.global_pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">Monthly</p>
                  <p className="text-xs text-muted-foreground">Publication</p>
                </div>
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">15 Departments</p>
                  <p className="text-xs text-muted-foreground">Full Coverage</p>
                </div>
                <div className="text-center">
                  <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">Online View</p>
                  <p className="text-xs text-muted-foreground">In-Browser</p>
                </div>
                <div className="text-center">
                  <Download className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">PDF Download</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NewsletterHighlights;