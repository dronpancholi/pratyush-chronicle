import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PDFViewer from '@/components/PDFViewer';
import SearchBar from '@/components/SearchBar';
import { useNewsletters } from '@/hooks/useNewsletters';
import { FileText, Calendar, Users, Download, Share2, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { departments } from '@/data/departments';

const CurrentIssue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentNewsletter, loading } = useNewsletters();
  
  // Filter departments based on search
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentNewsletter ? currentNewsletter.title : 'Pratyush Chronicle',
          text: 'Check out the latest newsletter from Government Polytechnic Ahmedabad',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading current issue...</p>
        </div>
      </div>
    );
  }

  if (!currentNewsletter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Current Issue</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            There is no published newsletter issue available at the moment. 
            Please check back later or contact the administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4">
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {currentNewsletter.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {currentNewsletter.description || "Latest newsletter from Pratyush Club"}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(currentNewsletter.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>16 Departments</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>Current Issue</span>
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Issue
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                disabled={!currentNewsletter.pdf_url}
              >
                <a href={currentNewsletter.pdf_url || '#'} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
              
              <Button asChild disabled={!currentNewsletter.pdf_url}>
                <a href={currentNewsletter.pdf_url || '#'} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Viewer Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="academic-card">
            <CardHeader>
              <CardTitle className="text-center">Newsletter PDF Viewer</CardTitle>
              <CardDescription className="text-center">
                Read the current issue online or use the buttons above to open in a new tab or download
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentNewsletter.pdf_url ? (
                <PDFViewer src={currentNewsletter.pdf_url} title={currentNewsletter.title} />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">PDF not available for this issue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Department Sections Overview */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Department Sections</h2>
            <p className="text-lg text-muted-foreground mb-6">
              This issue features content from all departments of Government Polytechnic Ahmedabad
            </p>
            
            <div className="max-w-lg mx-auto mb-8">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder="Search departments..."
                value={searchQuery}
              />
            </div>
          </div>

          <div className="department-grid">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="academic-card hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {department.shortName}
                      </Badge>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${department.category === 'engineering' ? 'bg-blue-100 text-blue-800' : ''}
                        ${department.category === 'technology' ? 'bg-green-100 text-green-800' : ''}
                        ${department.category === 'science' ? 'bg-purple-100 text-purple-800' : ''}
                        ${department.category === 'administrative' ? 'bg-gray-100 text-gray-800' : ''}
                      `}
                    >
                      {department.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {department.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Featured in current issue
                    </span>
                    <Button variant="outline" size="sm">
                      View Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No departments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms to find departments.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CurrentIssue;